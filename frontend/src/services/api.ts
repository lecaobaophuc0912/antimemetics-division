const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

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

export interface Todo {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TodoRequestDto {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
}

export interface TodoListResponse {
    data: Todo[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    timestamp: string;
    path: string;
}

export interface TodoQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface RefreshTokenResponse {
    accessToken: string;
    message: string;
}

class ApiService {
    private baseURL: string;
    private limitRetries = 3;

    constructor() {
        this.baseURL = API_BASE_URL;
        console.log('API_BASE_URL', this.baseURL);
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
            credentials: 'include',
        };

        // Add auth token if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        }

        try {
            const response = await fetch(url, config);
            if (response.status === 401) {
                let retries = 0;
                while (retries < this.limitRetries) {
                    // Token expired, try to refresh
                    try {
                        const newToken = await this.refreshAccessToken();
                        if (newToken?.data?.accessToken) {
                            // Retry the original request with new token
                            config.headers = {
                                ...config.headers,
                                Authorization: `Bearer ${newToken.data.accessToken}`,
                            };
                            localStorage.setItem('token', newToken.data.accessToken);
                            const retryResponse = await fetch(url, config);

                            if (!retryResponse.ok) {
                                const errorData = await retryResponse.json().catch(() => ({}));
                                const errorMessage = errorData.message || `HTTP error! status: ${retryResponse.status}`;
                                return Promise.reject({ message: errorMessage, status: retryResponse.status });
                            }

                            return await retryResponse.json();
                        }
                    } catch (refreshError) {
                        // Refresh failed, redirect to login
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                        return Promise.reject({ message: 'Authentication failed', status: 401 });
                    }
                    retries++;
                }
                return Promise.reject({ message: 'Authentication failed', status: 401 });
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
                return Promise.reject({ message: errorMessage, status: response.status });
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            return Promise.reject({
                message: error instanceof Error ? error.message : 'Network error occurred',
                status: 0
            });
        }
    }

    // Auth endpoints
    async login(data: LoginRequest): Promise<LoginResponse> {
        return this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async register(data: RegisterRequest): Promise<RegisterResponse> {
        return this.request<RegisterResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async logout(): Promise<void> {
        return this.request<void>('/auth/logout', {
            method: 'POST',
        });
    }

    async refreshAccessToken(): Promise<{
        data: RefreshTokenResponse
    }> {
        return this.request('/auth/refresh-token', {
            method: 'POST',
        });
    }

    // User endpoints
    async getProfile(): Promise<any> {
        return this.request('/auth/profile');
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        return this.request('/health');
    }

    // Todo endpoints
    async getTodos(queryParams: TodoQueryParams = {}, page: number = 1, limit: number = 10): Promise<TodoListResponse> {
        const queryRecord = {
            page: page.toString(),
            limit: limit.toString(),
            search: queryParams.search || '',
            status: queryParams.status || '',
            priority: queryParams.priority || '',
            dueDateFrom: queryParams.dueDateFrom || '',
            dueDateTo: queryParams.dueDateTo || '',
            sortBy: queryParams.sortBy || '',
            sortOrder: queryParams.sortOrder || 'DESC',
        };
        // Lọc lại bỏ những props nào không có giá trị hoặc là ';'
        Object.keys(queryRecord).forEach((key) => {
            const value = queryRecord[key as keyof typeof queryRecord];
            if (value === undefined || value === null || value === '' || value === ';') {
                delete queryRecord[key as keyof typeof queryRecord];
            }
        });
        const queryString = new URLSearchParams(queryRecord);

        return this.request<TodoListResponse>(`/todo?${queryString}`);
    }

    async createTodo(data: TodoRequestDto): Promise<Todo> {
        return this.request<Todo>('/todo', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getTodo(id: string): Promise<{
        data: Todo
    }> {
        return this.request<{ data: Todo }>(`/todo/${id}`);
    }

    async updateTodo(id: string, data: TodoRequestDto): Promise<Todo> {
        return this.request<Todo>(`/todo/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteTodo(id: string): Promise<void> {
        return this.request<void>(`/todo/${id}`, {
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService();
export default apiService;         