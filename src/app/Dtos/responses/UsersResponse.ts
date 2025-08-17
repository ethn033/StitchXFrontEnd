import { ERole } from "../../enums/enums";
import { Business } from "../requests/request-dto";

export interface UsersResponse {
    users: UserDto[];
    totalCount: number;
    pageSize: number;
    page: number;
    totalPages: number;
}

export interface UserDto {
    id: number;
    userId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    dateOfBirth?: Date | null;
    createdByUserId?: number | null;
    defaultRole: ERole;
    defaultRoleStr?: string | null;
    outstanding: number;
    roles: string[];
    business?: Business | null;
}