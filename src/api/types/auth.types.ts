import { ApiResponse } from ".";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export enum Role {
  PIMPINAN = "PIMPINAN",
  DITJAKSTRA = "DITJAKSTRA",
  DITRAH = "DITRAH",
  DITKERSIN = "DITKERSIN",
  DITWILHAN = "DITWILHAN",
  BAGUM = "BAGUM",
  BAGPROGLAP = "BAGPROGLAP",
  BAGDATIN = "BAGDATIN",
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
