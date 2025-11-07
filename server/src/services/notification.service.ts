import { Types } from "mongoose";
import { Notification } from "../models/notification.model";

interface CreateNotificationParams {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  visitorId?: Types.ObjectId;
}

export const createNotification = async (
  params: CreateNotificationParams
): Promise<void> => {
  try {
    await Notification.create({
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      visitorId: params.visitorId,
      isRead: false,
    });
  } catch (error) {
    console.error("Failed to create notification: ", error);
  }
};

export const getUserNotifications = async (
  userId: string,
  unreadOnly = false
) => {
  const query = unreadOnly ? { userId, isRead: false } : { userId };

  return await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("visitorId", "name passNumber");
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await Notification.findByIdAndUpdate(notificationId, { isRead: true });
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};