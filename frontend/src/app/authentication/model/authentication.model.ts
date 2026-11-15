export interface LoginRequest {
    username: string;
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