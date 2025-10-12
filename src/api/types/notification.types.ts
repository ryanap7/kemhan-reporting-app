import { ApiResponse, Pagination } from ".";

export type GetUnreadNotificationResponse = ApiResponse<{
  unreadCount: number;
}>;

export type Notification = {
  id: string;
  userId: string | null;
  role: string;
  taskId: string;
  title: string;
  subtitle: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  task: {
    id: string;
    title: string;
    status: string;
    priority: number;
  };
  user: any | null;
};

export type GetAllNotificationResponse = {
  success: boolean;
  message: string;
  data: Notification[];
  pagination: Pagination;
};

export type ReadNotificationResponse = ApiResponse<Notification>;
