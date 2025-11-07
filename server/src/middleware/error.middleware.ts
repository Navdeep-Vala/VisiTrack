import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.utils";
import { isDevelopment } from "../config/env.config";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: isDevelopment ? err.stack : undefined,
    });

    return;
  }
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
    return;
  }

  if ((err as any).code === 11000) {
    res.status(409).json({
      success: false,
      message: "Duplicate field value entered",
    });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    stack: isDevelopment ? err.stack : undefined,
  });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
