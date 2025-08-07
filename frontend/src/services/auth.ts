import axiosInstance from './axios';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    RefreshTokenResponse,
    ProfileResponse
} from '@/declaration';

class AuthService {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
        return response.data;
    }

    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const response = await axiosInstance.post<RegisterResponse>('/auth/register', data);
        return response.data;
    }

    async logout(): Promise<void> {
        await axiosInstance.post('/auth/logout');
    }

    async refreshAccessToken(): Promise<{
        data: RefreshTokenResponse
    }> {
        const response = await axiosInstance.post<{ data: RefreshTokenResponse }>('/auth/refresh-token');
        return response.data;
    }

    async getProfile(): Promise<ProfileResponse> {
        const response = await axiosInstance.get<ProfileResponse>('/auth/profile');
        return response.data;
    }
}

export const authService = new AuthService();
export default authService; 