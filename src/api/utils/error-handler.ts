import { AxiosError } from "axios";
import { Alert } from "react-native";
import { ApiError } from "../types";

export class ApiException extends Error {
  public readonly status: number;
  public readonly code?: string | number;
  public readonly details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiException";
    this.status = error.status;
    this.code = error.code;
    this.details = error.details;
  }
}

export function handleApiError(error: unknown): ApiError {
  const defaultError: ApiError = {
    status: 500,
    message: "Terjadi kesalahan yang tidak terduga",
    timestamp: new Date().toISOString(),
  };

  if (!error || typeof error !== "object" || !("isAxiosError" in error)) {
    return {
      ...defaultError,
      message:
        error instanceof Error ? error.message : "Kesalahan tidak dikenal",
    };
  }

  const axiosError = error as AxiosError<any>;
  const status = axiosError.response?.status || 0;
  const data = axiosError.response?.data ?? {};
  const config = axiosError.config;
  const code = data?.errors?.code ?? data?.code ?? axiosError.code ?? undefined;

  // Extract message from response - handle both formats
  const responseMessage = data?.message || data?.errors?.message;

  const apiError: ApiError = {
    status,
    message: responseMessage || defaultError.message,
    code,
    details: data?.details || data,
    timestamp: new Date().toISOString(),
    path: config?.url,
  };

  // Mobile-specific error messages (only if no message from backend)
  if (!responseMessage) {
    switch (status) {
      case 400:
        apiError.message = "Data yang dikirim tidak valid atau ditolak";
        break;
      case 401:
        apiError.message = "Sesi berakhir, silakan login kembali";
        break;
      case 403:
        apiError.message = "Akses ditolak untuk tindakan ini";
        break;
      case 404:
        apiError.message = "Data tidak ditemukan";
        break;
      case 408:
        apiError.message = "Koneksi timeout. Periksa jaringan internet Anda";
        break;
      case 409:
        apiError.message = "Data sudah ada";
        break;
      case 422:
        apiError.message = "Data tidak dapat diproses";
        break;
      case 429:
        apiError.message =
          "Terlalu banyak permintaan. Coba lagi dalam beberapa saat";
        break;
      case 500:
        apiError.message = "Server bermasalah. Tim kami sedang memperbaikinya";
        break;
      case 502:
      case 503:
      case 504:
        apiError.message = "Server tidak tersedia. Coba lagi nanti";
        break;
      default:
        if (status === 0) {
          if (axiosError.code === "ECONNABORTED") {
            apiError.message =
              "Koneksi timeout. Periksa jaringan internet Anda";
          } else if (axiosError.code === "ERR_NETWORK") {
            apiError.message =
              "Tidak dapat terhubung. Periksa koneksi internet Anda";
          } else {
            apiError.message = "Tidak ada koneksi internet";
          }
        }
    }
  }

  return apiError;
}

export const showMessageError = (error: unknown, title: string) => {
  if (error instanceof ApiException && error.status === 401) {
    return;
  }

  if (error instanceof ApiException) {
    Alert.alert(title, error.message);
  } else {
    Alert.alert(title, "Terjadi kesalahan yang tidak terduga");
  }
};
