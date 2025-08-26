import { Order, User } from "./request-dto";

export interface UserResponse {
  user: User;
  tokenResponse: TokenResponse;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UsersResponse {
    users: User[];
    totalCount: number;
    pageSize: number;
    page: number;
    totalPages: number;
}

export interface CustomerResponse {
    customers: User[];
    totalCount: number;
    pageSize: number;
    page: number;
    totalPages: number;
}

export interface OrdersResponse {
    users: Order[];
    totalCount: number;
    pageSize: number;
    page: number;
    totalPages: number;
}


