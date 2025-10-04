import { api } from "../config/axios.config";
import { SecureTokenManager } from "../utils/token-manager";

export const setupRequestInterceptor = () => {
  api.interceptors.request.use(
    (config) => {
      try {
        // Add authentication token
        const token = SecureTokenManager.getToken();

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      } catch (error) {
        console.error("Request interceptor error:", error);
        return config;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
