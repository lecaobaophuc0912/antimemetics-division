import { ErrorResponseBody, ExceptionResponse } from '@/declaration';
import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const excludePaths = ['/auth/login', '/auth/register', '/auth/refresh-token'];

// Flag to track if refresh token request is in progress
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        let originalRequest: InternalAxiosRequestConfig = error.config as InternalAxiosRequestConfig;
        if (error.response?.status === 401 && !excludePaths.includes(originalRequest.url || '')) {
            // Check if it's a refresh token error
            const errorData = error.response.data as ErrorResponseBody;
            if (errorData.detailCode === 'REFRESH_TOKEN_INVALID' ||
                errorData.error === 'RefreshTokenError') {
                // Clear tokens and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject({ message: 'Refresh token invalid', status: 401 });
            }

            // If already refreshing, add to queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;

            // Try to refresh access token
            try {
                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (response.data?.data?.accessToken) {
                    const newToken = response.data.data.accessToken;
                    localStorage.setItem('token', newToken);
                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                processQueue(refreshError, null);
                // window.location.href = '/login';
                console.log('========');
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 