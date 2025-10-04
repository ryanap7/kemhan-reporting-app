import { ApiResponse } from ".";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export enum Role {
  PIMPINAN = "PIMPINAN",
  SUBDIT_HANMIL = "SUBDIT_HANMIL",
  SUBDIT_HANNIRMIL = "SUBDIT_HANNIRMIL",
  SUBDIT_MPP = "SUBDIT_MPP",
  SUBDIT_ANSTRA = "SUBDIT_ANSTRA",
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginData {
  user: User;
  tokens: AuthTokens;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export type LoginResponse = ApiResponse<LoginData>;

export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export type RefreshTokenResponse = ApiResponse<RefreshTokenData>;
