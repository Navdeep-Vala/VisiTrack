import asyncHandler from "express-async-handler";
import { AuthRequest, UserRole } from "../types";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/error.utils";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.utils";

export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError("User with  this email already exists.");
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || UserRole.EMPLOYEE,
    });

    const tokens = await generateTokenPair({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        ...tokens,
      },
    });
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("Account is deactivated");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const tokens = generateTokenPair({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    },
  });
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError("Refresh token is required");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      throw new UnauthorizedError("User not found or inactive");
    }

    const tokens = generateTokenPair({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: tokens,
    });
  }
);

export const getCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  }
);

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
