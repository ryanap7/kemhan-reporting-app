export const API_CONFIG = {
  baseURL:
    process.env.EXPO_PUBLIC_BASE_URL ||
    "https://services-kemhan-reporting.digitalindotekno.com/api/v1",
  timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "10000"),
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
    SET_TOKEN: "/users/fcm-token",
  },
  TASK: {
    GET_ALL: "/tasks",
    DRAFT: "/tasks/draft/list",
    CREATE: "/tasks",
    BY_SUBDIT: (subditRole: string) => `/tasks/subdit/${subditRole}`,
    DISPOSITION: (taskId: string) => `/tasks/${taskId}/disposition`,
    GET_BY_ID: (taskId: string) => `/tasks/${taskId}`,
    UPDATE_PROGRESS: (taskId: string, checklistId: string) =>
      `/tasks/${taskId}/checklist/${checklistId}`,
  },
  NOTIFICATION: {
    ALL: "/notifications",
    UNREAD: "/notifications/unread-count",
    READ: (notificationId: string) => `/notifications/${notificationId}/read`,
  },
  MONITOR: {
    STATISTIC: "/monitoring/dashboard",
    STUCK: "/monitoring/stuck-tasks",
  },
} as const;
