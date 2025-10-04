export const API_CONFIG = {
  // baseURL: process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000/api/v1",
  baseURL: "http://localhost:4000/api/v1",
  timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "10000"),
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  TASK: {
    GET_ALL: "/tasks",
    CREATE: "/tasks",
    GET_BY_ID: (taskId: string) => `/tasks/${taskId}`,
    UPDATE_PROGRESS: (taskId: string, checklistId: string) =>
      `/tasks/${taskId}/checklist/${checklistId}`,
  },
  MONITOR: {
    STATISTIC: "/monitoring/dashboard",
    STUCK: "/monitoring/stuck-tasks",
  },
} as const;
