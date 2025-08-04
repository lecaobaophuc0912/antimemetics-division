import { IsOptional, IsString, IsNumber, IsEnum, Min, Max, IsDate, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TodoStatus, TodoPriority } from '../config/todo.entity';
import { TransformDate } from '../decorators/transform-date.decorator';

export class TodoQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Page must be a number' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Limit must be a number' })
    @Min(1, { message: 'Limit must be at least 1' })
    @Max(100, { message: 'Limit cannot exceed 100' })
    limit?: number = 10;

    @IsOptional()
    @IsString({ message: 'Search must be a string' })
    search?: string;

    @IsOptional()
    @IsEnum(TodoStatus, { message: 'Status must be a valid todo status' })
    status?: TodoStatus;

    @IsOptional()
    @IsEnum(TodoPriority, { message: 'Priority must be a valid todo priority' })
    priority?: TodoPriority;

    @IsOptional()
    @TransformDate()
    @IsDate({ message: 'Due date from must be a valid date' })
    dueDateFrom?: Date;

    @IsOptional()
    @TransformDate()
    @IsDate({ message: 'Due date to must be a valid date' })
    dueDateTo?: Date;

    @IsOptional()
    @IsString({ message: 'Sort by must be a string' })
    @IsIn(['id', 'title', 'status', 'priority', 'dueDate', 'createdAt', 'updatedAt'], {
        message: 'Sort by must be one of: id, title, status, priority, dueDate, createdAt, updatedAt'
    })
    sortBy?: string = 'id';

    @IsOptional()
    @IsString({ message: 'Sort order must be a string' })
    @IsIn(['ASC', 'DESC'], { message: 'Sort order must be either ASC or DESC' })
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
} 