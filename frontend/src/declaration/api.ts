export interface HealthCheckResponse {
    status: string;
    timestamp: string;
}

export interface ApiError {
    message: string;
    status: number;
    detailCode?: string;
    error?: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface SortParams {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface BaseResponse<T> {
    data: T;
    message?: string;
    status?: string;
} 