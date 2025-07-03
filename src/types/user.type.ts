// User types
export interface User {
    id: string;
    userName: string;
    avatarUrl?: string;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
    isVerify: boolean;
    birthDate?: string;
}

export interface Seller {
    id: string;
    userName: string;
    avatarUrl?: string;
    phoneNumber?: string;
    createdAt?: string;
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}