import { NextFunction, Response } from "express";
import { AuthRequest } from "../types";
import asyncHandler from "express-async-handler";
import {
  getUserNotifications,
  markAllAsRead,
  markNotificationAsRead,
} from "../services/notification.service";

// Here in this function I have not used asyncHandler provided by express-async-handler,
// so here I need to manually write try-catch logic.
export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { unreadOnly } = req.query;
    const notifications = await getUserNotifications(
      req.user!.id,
      unreadOnly === "true"
    );

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res
        .status(400)
        .json({ success: false, message: "Notification ID required" });
      return;
    }
    await markNotificationAsRead(id);

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  }
);

export const markAllNotificationsAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await markAllAsRead(req.user!.id);

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  }
);
