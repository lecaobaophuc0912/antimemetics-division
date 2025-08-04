import { IsString, IsNotEmpty, IsDate, IsArray, IsOptional, IsNumber } from "class-validator";

export class TodoRequestDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    priority: string;

    @IsString()
    @IsNotEmpty()
    dueDate: string;

    @IsString()
    @IsOptional()
    userId: string;
}

export class TodoDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    priority: string;

    @IsDate()
    @IsNotEmpty()
    dueDate: Date;

    @IsString()
    @IsOptional()
    userId: string;
}

export class TodoResponseDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    title: string;
}

export class TodoListResponseDto {
    @IsArray()
    @IsNotEmpty()
    data: TodoResponseDto[];

    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsNumber()
    @IsNotEmpty()
    page: number;

    @IsNumber()
    @IsNotEmpty()
    limit: number;

    @IsNumber()
    @IsNotEmpty()
    totalPages: number;
}