import { API_ENDPOINTS } from "@/src/constants/api.constants";
import { api } from "../config/axios.config";
import { LoginPayload, LoginResponse, RefreshTokenResponse } from "../types";

export class AuthService {
  static async refreshToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      {
        refreshToken,
      }
    );

    return response.data;
  }

  static async login(data: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  }

  static async storeFcmToken(fcmToken: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.SET_TOKEN,
      {
        fcmToken,
      }
    );
    return response.data;
  }
}
