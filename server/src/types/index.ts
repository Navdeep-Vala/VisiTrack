import { Request } from 'express';
import { Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  RECEPTIONIST = 'receptionist',
}

export enum VisitorStatus {
  SCHEDULED = 'scheduled',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IVisitor {
  _id: Types.ObjectId;
  name: string;
  contactNumber: string;
  company?: string;
  purpose: string;
  hostEmployeeId: Types.ObjectId;
  visitDate: Date;
  idNumber?: string;
  passNumber: string;
  status: VisitorStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  gateNumber?: string;
  remarks?: string;
  createdBy: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  _id: Types.ObjectId;
  action: string;
  entityType: string;
  entityId: Types.ObjectId;
  userId: Types.ObjectId;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface INotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  visitorId?: Types.ObjectId;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface DashboardStats {
  totalToday: number;
  currentlyInside: number;
  scheduledToday: number;
  checkedOutToday: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: VisitorStatus;
  dateFrom?: string;
  dateTo?: string;
  hostEmployeeId?: string;
  company?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}