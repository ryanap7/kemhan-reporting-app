export const STORAGE_KEYS = {
  AUTH_TOKEN: "@auth_token",
  REFRESH_TOKEN: "@refresh_token",
  USER_DATA: "@user_data",
} as const;

export const MMKV_CONFIG = {
  SECURE_TOKENS: {
    id: "secure-tokens",
    encryptionKey: "secure-token-key-2024",
  },
  APP_STORAGE: {
    id: "app-storage",
    encryptionKey: "app-storage-key-2024",
  },
} as const;
