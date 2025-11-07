import asyncHandler from "express-async-handler";
import { AuthRequest, UserRole, VisitorStatus } from "../types";
import { Response } from "express";
import { Visitor } from "../models/visitor.model";

export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalToday, currentlyInside, scheduledToday, checkedOutToday] =
      await Promise.all([
        Visitor.countDocuments({
          visitDate: { $gte: today, $lt: tomorrow },
        }),
        Visitor.countDocuments({
          status: VisitorStatus.CHECKED_IN,
          visitDate: { $gte: today, $lt: tomorrow },
        }),
        Visitor.countDocuments({
          status: VisitorStatus.SCHEDULED,
          visitDate: { $gte: today, $lt: tomorrow },
        }),
        Visitor.countDocuments({
          status: VisitorStatus.CHECKED_OUT,
          visitDate: { $gte: today, $lt: tomorrow },
        }),
      ]);

    res.json({
      success: true,
      data: {
        totalToday,
        currentlyInside,
        scheduledToday,
        checkedOutToday,
      },
    });
  }
);

export const getCurrentVisitors = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const visitors = await Visitor.find({
      status: VisitorStatus.CHECKED_IN,
    })
      .populate("hostEmployeeId", "firstname lastname email")
      .populate("createdBy", "firstname lastname")
      .sort({ checkInTime: -1 });

    res.json({
      success: true,
      data: visitors,
    });
  }
);
