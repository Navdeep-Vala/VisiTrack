import { NextFunction, Response } from "express";
import { AuthRequest, UserRole } from "../types";
import { ForbiddenError, UnauthorizedError } from "../utils/error.utils";
import { verifyAccessToken } from "../utils/jwt.utils";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeaders.split(" ")[1]!;
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      next(new UnauthorizedError("Token expired"));
    } else if (error instanceof Error && error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("Invalid Token"));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        "You do not have permission to perform this action"
      );
    }

    next();
  };
};
