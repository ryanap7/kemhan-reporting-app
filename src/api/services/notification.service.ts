import { API_ENDPOINTS } from "@/src/constants/api.constants";
import { api } from "../config/axios.config";
import {
  GetAllNotificationResponse,
  GetUnreadNotificationResponse,
  ReadNotificationResponse,
} from "../types";

export class NotificationService {
  static async getUnreadNotification(): Promise<GetUnreadNotificationResponse> {
    const response = await api.get<GetUnreadNotificationResponse>(
      API_ENDPOINTS.NOTIFICATION.UNREAD
    );
    return response.data;
  }

  static async getNotifications(
    page: number
  ): Promise<GetAllNotificationResponse> {
    const response = await api.get<GetAllNotificationResponse>(
      `${API_ENDPOINTS.NOTIFICATION.ALL}?page=${page}&includeRead=true`
    );
    return response.data;
  }

  static async readNotification(
    notificationId: string
  ): Promise<ReadNotificationResponse> {
    const response = await api.put<ReadNotificationResponse>(
      API_ENDPOINTS.NOTIFICATION.READ(notificationId)
    );
    return response.data;
  }
}
