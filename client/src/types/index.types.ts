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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive?: boolean;
}

export interface Visitor {
  _id: string;
  name: string;
  contactNumber: string;
  company?: string;
  purpose: string;
  hostEmployeeId: User;
  visitDate: string;
  idNumber?: string;
  passNumber: string;
  status: VisitorStatus;
  checkInTime?: string;
  checkOutTime?: string;
  gateNumber?: string;
  remarks?: string;
  createdBy: User;
  approvedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalToday: number;
  currentlyInside: number;
  scheduledToday: number;
  checkedOutToday: number;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  visitorId?: Visitor;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}