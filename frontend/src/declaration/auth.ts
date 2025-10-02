export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: {
        accessToken: string;
        message: string;
        user: {
            id: string;
            email: string;
            name?: string;
            avatarUrl?: string | null;
        };
    }
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
}

export interface RefreshTokenResponse {
    accessToken: string;
    message: string;
}

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string | null;
}

export interface ProfileResponse {
    data: UserProfile;
} 