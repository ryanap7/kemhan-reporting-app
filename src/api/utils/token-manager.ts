import { secureTokensMMKV } from "@/src/stores/storage/mmkv.adapter";
import { AuthTokens } from "../types";

export class SecureTokenManager {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly FCM_TOKEN_KEY = "fcmToken";

  static getToken(): string | null {
    return secureTokensMMKV.getString(this.ACCESS_TOKEN_KEY) ?? null;
  }

  static setToken(token: string): void {
    secureTokensMMKV.set(this.ACCESS_TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return secureTokensMMKV.getString(this.REFRESH_TOKEN_KEY) ?? null;
  }

  static setRefreshToken(token: string): void {
    secureTokensMMKV.set(this.REFRESH_TOKEN_KEY, token);
  }

  static getFcmToken(): string | null {
    return secureTokensMMKV.getString(this.FCM_TOKEN_KEY) ?? null;
  }

  static setFcmToken(token: string): void {
    secureTokensMMKV.set(this.FCM_TOKEN_KEY, token);
  }

  static setTokens(tokens: AuthTokens): void {
    secureTokensMMKV.set(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    secureTokensMMKV.set(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  static clearTokens(): void {
    secureTokensMMKV.clearAll();
  }

  static getTokens(): AuthTokens | null {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresIn: "24h",
    };
  }
}
