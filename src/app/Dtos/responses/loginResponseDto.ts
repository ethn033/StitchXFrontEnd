import { ERole } from "../../enums/enums";

export interface LoginResponse {
  user: UserWithRoles;
  tokenResponse: TokenResponse;
}

export interface UserWithRoles {
  id: number;
  userId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdByUserId?: number;
  defaultRole: ERole;
  defaultRoleStr?: string;
  outstanding: number;
  roles: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}