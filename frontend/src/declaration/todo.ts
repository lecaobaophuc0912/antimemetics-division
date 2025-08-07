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

export interface TodoDetailResponse {
    data: Todo;
} 