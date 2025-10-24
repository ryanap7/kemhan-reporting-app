export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
  timestamp?: string;
  path?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export * from "./auth.types";
export * from "./notification.types";
export * from "./statistic.types";
export * from "./task.types";
export * from "./user.types";
