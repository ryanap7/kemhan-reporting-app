import { useAuthStore } from "@/src/stores";
import { AxiosError, AxiosResponse } from "axios";
import { router } from "expo-router";
import { api } from "../config/axios.config";
import { ApiException, handleApiError } from "../utils";
import { SecureTokenManager } from "../utils/token-manager";

let isLoggingOut = false;

export const setupResponseInterceptor = () => {
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      // Handle token refresh for 401 errors
      if (error.response?.status === 401 && !isLoggingOut) {
        isLoggingOut = true;

        try {
          // Clear tokens dan auth state
          await SecureTokenManager.clearTokens();

          // Clear auth store
          const authStore = useAuthStore.getState();
          authStore.clearAuth();

          // Redirect ke login
          router.replace("/(auth)/login");
        } catch (clearError) {
          console.error("Error clearing auth:", clearError);
        }

        return new Promise(() => {});
      }

      const apiError = handleApiError(error);
      const exception = new ApiException(apiError);

      return Promise.reject(exception);
    }
  );
};
