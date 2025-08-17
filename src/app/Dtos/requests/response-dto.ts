import { User } from "./request-dto";

export interface UserResponse {
  user: User;
  tokenResponse: TokenResponse;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}