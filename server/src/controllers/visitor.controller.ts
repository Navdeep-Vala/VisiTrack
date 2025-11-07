import asyncHandler from "express-async-handler";
import { AuthRequest, VisitorStatus } from "../types";
import { Response } from "express";
import { Types } from "mongoose";
import { ForbiddenError, NotFoundError, ValidationError } from "../utils/error.utils";
import { createAuditLog } from "../services/audit.service";
import { Visitor } from "../models/visitor.model";
import { createNotification } from "../services/notification.service";

export const createVisitor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      name,
      contactNumber,
      company,
      purpose,
      hostEmployeeId,
      visitDate,
      idNumber,
      remarks,
    } = req.body;

    const visitor = await Visitor.create({
      name,
      contactNumber,
      company,
      purpose,
      hostEmployeeId,
      visitDate,
      idNumber,
      remarks,
      status: VisitorStatus.SCHEDULED,
      createdBy: req.user?.id,
    });

    await createAuditLog({
      action: "CREATE_VISITOR",
      entityType: "Visitor",
      entityId: visitor._id,
      userId: new Types.ObjectId(req.user?.id),
      metadata: { visitorName: name },
    });

    res.status(201).json({
      success: true,
      data: await visitor.populate(["hostEmployeeId", "createdBy"]),
    });
  }
);

export const getVisitors = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "visitDate",
      sortOrder = "desc",
      search,
      status,
      dateFrom,
      dateTo,
      hostEmployeeId,
      company,
    } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $option: "i" } },
        { contactNumber: { $regex: search, $option: "i" } },
        { passNumber: { $regex: search, $option: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (hostEmployeeId) {
      query.hostEmployeeId = hostEmployeeId;
    }

    if (company) {
      query.company = { $regex: company, $option: "i" };
    }

    if (dateFrom || dateTo) {
      query.visitDate = {};

      if (dateFrom) query.visitDate.$gte = new Date(dateFrom);
      if (dateTo) query.visitDate.$gte = new Date(dateTo);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [visitors, total] = await Promise.all([
      Visitor.find(query)
        .populate("hostEmployeeId", "firstname lastname email")
        .populate("createdBy", "firstname lastname")
        .populate("approvedBy", "firstname lastname")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Visitor.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: visitors,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

export const getvisitorById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const visitor = await Visitor.findById(req.params.id)
      .populate("hostEmployeeId", "firstname lastname email")
      .populate("createdBy", "firstname lastname")
      .populate("approvedBy", "firstname lastname");

    if (!visitor) {
      throw new NotFoundError("Visitor not found");
    }

    res.json({
      success: true,
      data: visitor,
    });
  }
);

export const updateVisitor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const visitor = Visitor.findById(req.params.id);
    if (!visitor) {
      throw new NotFoundError("Visitor Not Found");
    }

    if (
      visitor.status === VisitorStatus.CHECKED_OUT ||
      visitor.status === VisitorStatus.CANCELLED
    ) {
      throw new ValidationError(
        "Cannot update visitor with checked-out or cancelled status"
      );
    }

    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(["hostEmployeeId", "createdBy", "approvedBy"]);

    await createAuditLog({
      action: "UPDATE_VISITOR",
      entityType: "Visitor",
      entityId: visitor._id,
      userId: new Types.ObjectId(req.user?.id),
      changes: req.body,
    });

    res.json({
      success: true,
      data: updatedVisitor,
    });
  }
);

export const checkInVisitor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { gateNumber } = req.body;

    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      throw new NotFoundError("Visitor not found");
    }

    if (visitor.status !== VisitorStatus.SCHEDULED) {
      throw new ValidationError("Only scheduled visitors can be checked in");
    }

    visitor.status = VisitorStatus.CHECKED_IN;
    visitor.checkInTime = new Date();
    visitor.gateNumber = gateNumber;
    await visitor.save();

    await createAuditLog({
      action: "CHECKED_IN",
      entityType: "visitor",
      entityId: visitor._id,
      userId: new Types.ObjectId(req.user?.id),
      metadata: { gateNumber },
    });

    await createNotification({
      userId: visitor.hostEmployeeId,
      title: "Visitor checked In",
      message: `${visitor.name} has checked in at gate ${gateNumber}`,
      type: "info",
      visitorId: visitor._id,
    });

    res.json({
      success: true,
      data: await visitor.populate(["hostEmployeeId", "createdBy"]),
    });
  }
);

export const checkOutVisitor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const visitor = Visitor.findById(req.params.id);

    if (!visitor) {
      throw new NotFoundError("Visitor not found");
    }

    if (visitor.status !== VisitorStatus.CHECKED_IN) {
      throw new ValidationError("Only checked-in visitors can be checked out");
    }

    visitor.status = VisitorStatus.CHECKED_OUT;
    visitor.checkOutTime = new Date();
    await visitor.save();

    await createAuditLog({
      action: "CHECK_OUT",
      entity_type: "Visitor",
      entityId: visitor._id,
      userId: new Types.ObjectId(req.user?.id),
    });

    res.json({
      success: true,
      data: await visitor.populate(["hostEmployeeId", "createdBy"]),
    });
  }
);

export const cancelVisitor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      throw new NotFoundError("Visitor not found");
    }

    if (
      visitor.status === VisitorStatus.CANCELLED ||
      visitor.status === VisitorStatus.CHECKED_OUT
    ) {
      throw new ValidationError("Cannot cancel this visitor");
    }

    visitor.status = VisitorStatus.CANCELLED;
    await visitor.save();

    await createAuditLog({
      action: "CANCEL_VISITOR",
      entityType: "Visitor",
      entityId: visitor._id,
      userId: new Types.ObjectId(req.user?.id),
    });

    res.json({
      success: true,
      data: await visitor.populate(["hostEmployeeId", "createdBy"]),
    });
  }
);

export const approveVisitor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      throw new NotFoundError("Visitor not found");
    }

    if (visitor.hostEmployeeId.toString() !== req.user?.id) {
      throw new ForbiddenError(
        "Only the host employee can approve this visitor"
      );
    }

    if (visitor.status !== VisitorStatus.SCHEDULED) {
      throw new ValidationError("Only scheduled visitors can be approved");
    }

    visitor.approvedBy = new Types.ObjectId(req.user?.id);
    await visitor.save();

    await createAuditLog({
      action: "APPROVE_VISITOR",
      entityType: "Visitor",
      entityId: visitor._id,
      userId: new Types.ObjectId(req.user?.id),
    });

    res.json({
      success: true,
      data: await visitor.populate([
        "hostEmployeeId",
        "createdBy",
        "approvedBy",
      ]),
    });
  }
);
