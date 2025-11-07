import asyncHandler from "express-async-handler";
import { AuthRequest, UserRole } from "../types";
import { Response } from "express";
import { User } from "../models/user.model";
import { NotFoundError } from "../utils/error.utils";

export const getUsers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { role, search } = req.query;

    const query: any = {};
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).sort({ firstname: 1 });

    res.json({
      success: true,
      data: users,
    });
  }
);

export const getUserById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.find(req.params.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({
      success: true,
      data: user,
    });
  }
);

export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { firstname, lastname, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstname, lastname, role, isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({
      success: true,
      data: user,
    });
  }
);

export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  }
);

export const searchEmployees = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { q } = req.query;

    const employees = await User.find({
      role: UserRole.EMPLOYEE,
      isActive: true,
      $or: [
        { firstname: { $regex: q as string, $options: "i" } },
        { lastname: { $regex: q as string, $options: "i" } },
        { email: { $regex: q as string, $options: "i" } },
      ],
    })
      .select("firstname lastname email")
      .limit(10);

    res.json({
      success: true,
      data: employees,
    });
  }
);
