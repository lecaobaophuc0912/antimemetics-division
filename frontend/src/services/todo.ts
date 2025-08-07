import axiosInstance from './axios';
import type {
    Todo,
    TodoRequestDto,
    TodoListResponse,
    TodoQueryParams,
    TodoDetailResponse
} from '@/declaration';

class TodoService {
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

        // Filter out empty values
        Object.keys(queryRecord).forEach((key) => {
            const value = queryRecord[key as keyof typeof queryRecord];
            if (value === undefined || value === null || value === '' || value === ';') {
                delete queryRecord[key as keyof typeof queryRecord];
            }
        });

        const queryString = new URLSearchParams(queryRecord);
        const response = await axiosInstance.get<TodoListResponse>(`/todo?${queryString}`);
        return response.data;
    }

    async createTodo(data: TodoRequestDto): Promise<Todo> {
        const response = await axiosInstance.post<Todo>('/todo', data);
        return response.data;
    }

    async getTodo(id: string): Promise<TodoDetailResponse> {
        const response = await axiosInstance.get<TodoDetailResponse>(`/todo/${id}`);
        return response.data;
    }

    async updateTodo(id: string, data: TodoRequestDto): Promise<Todo> {
        const response = await axiosInstance.put<Todo>(`/todo/${id}`, data);
        return response.data;
    }

    async deleteTodo(id: string): Promise<void> {
        await axiosInstance.delete(`/todo/${id}`);
    }
}

export const todoService = new TodoService();
export default todoService; 