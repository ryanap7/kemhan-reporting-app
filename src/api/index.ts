import { AxiosRequestConfig } from "axios";
import { api } from "./config/axios.config";
import { setupRequestInterceptor } from "./interceptors/request.interceptor";
import { setupResponseInterceptor } from "./interceptors/response.interceptor";
import { ApiException, handleApiError } from "./utils/error-handler";

// Setup interceptors
setupRequestInterceptor();
setupResponseInterceptor();

// Generic API call wrapper
export async function apiCall<T = any>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    const apiError = handleApiError(error);
    throw new ApiException(apiError);
  }
}

// Convenience methods
export const apiMethods = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiCall({ ...config, method: "GET", url }),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => apiCall({ ...config, method: "POST", url, data }),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => apiCall({ ...config, method: "PUT", url, data }),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => apiCall({ ...config, method: "PATCH", url, data }),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiCall({ ...config, method: "DELETE", url }),
};

// Export everything
export * from "./services";
export * from "./types";
export * from "./utils";
export { api };
