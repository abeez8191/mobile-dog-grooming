export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    key: string;
}

export interface LogoutRequest {
    key: string;
}

export interface LogoutResponse {
    detail: string;
}

export interface UserInformation {
    email: string;
    groomer?: number;
    customer?: number;
    is_superuser?: boolean;
}

export interface CustomerAccountRequest {
    email: string,
    password: string,
    customer: number
}

export interface CustomerAccountResponse {
    pk: number,
    email: string,
    customer: number,
}

export interface GroomerAccountRequest {
    email: string,
    password: string,
    groomer: number
}

export interface GroomerAccountResponse {
    pk: number,
    email: string,
    groomer: number,
}