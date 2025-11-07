import { Types } from "mongoose";
import { AuditLog } from "../models/audit-log.model";

interface CreateAuditLogParams {
  action: string;
  entityType: string;
  entityId: Types.ObjectId;
  userId: Types.ObjectId;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export const createAuditLog = async (
  params: CreateAuditLogParams
): Promise<void> => {
  try {
    await AuditLog.create(params);
  } catch (error) {
    console.error("Failed to create audit log: ", error);
  }
};
