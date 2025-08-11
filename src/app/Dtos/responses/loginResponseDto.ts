import { ERole } from "../../enums/enums";

export interface LoginResponse {
  user: UserResponse;
  tokenResponse: TokenResponse;
}

export interface UserResponse {
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
  business: BusinessesResponse;
  roles: string[];
}

export interface BusinessesResponse {
    id: number;
    name?: string;
    phone?: string;
    website?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    applicationUserId?: number;
    createdByUserId?: number;
    isDeleted: boolean;
    isActive: boolean;
    deletedAt?: Date;
    user?: User;
    branches?: BranchResponse[];
}


export interface BranchResponse {
    id: number;
    businessId: number;
    applicationUserId: number;
    name: string;
    address: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    createdAt?: Date;
    updatedAt?: Date;
    createdByUserId?: number;
    isDeleted: boolean;
    isActive: boolean;
    deletedAt?: Date;
    business?: BusinessesResponse;
}

export interface User {
    userId?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    city?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}