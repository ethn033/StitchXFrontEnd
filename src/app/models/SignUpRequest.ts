import { LoginRequest } from "./LoginRequest";

export interface SignUpRequest extends LoginRequest {
    name: string;
}