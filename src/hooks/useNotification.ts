import { useCallback, useState } from "react";
import {
  Notification,
  NotificationService,
  Pagination,
  showMessageError,
} from "../api";

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const getUnreadNotification = useCallback(async () => {
    try {
      const response = await NotificationService.getUnreadNotification();

      const { unreadCount } = response.data;

      setUnread(unreadCount);
    } catch (error) {
      showMessageError(error, "Gagal Ambil Notifikasi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNotifications = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const response = await NotificationService.getNotifications(page);

      const { data, pagination } = response;

      if (page === 1) {
        setNotifications(data);
      } else {
        setNotifications((prev) => [...prev, ...data]);
      }

      setPagination(pagination);
    } catch (error) {
      showMessageError(error, "Gagal Ambil Notifikasi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const readNotification = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.readNotification(notificationId);
    } catch (error) {
      showMessageError(error, "Gagal Membaca Notifikasi");
    }
  }, []);

  return {
    notifications,
    unread,
    pagination,
    isLoading,

    getNotifications,
    getUnreadNotification,
    readNotification,
  };
}
