import { HttpStatus } from '@nestjs/common';

// Exception Response Types
export interface ExceptionResponse {
    statusCode: number;
    message: string;
    error: string;
    code?: string;
    details?: unknown;
    errors?: unknown;
}

// HttpException Response Type
export interface HttpExceptionResponse extends ExceptionResponse {
    code?: string;
    errors?: unknown;
}

// Custom Exception Response Types
export interface RefreshTokenExceptionResponse extends ExceptionResponse {
    code: 'REFRESH_TOKEN_INVALID';
    error: 'RefreshTokenError';
}

export interface ValidationExceptionResponse extends ExceptionResponse {
    statusCode: 400;
    error: 'Bad Request';
}

// Database Exception Types
export interface DatabaseExceptionResponse extends ExceptionResponse {
    error: 'QueryFailedError' | 'EntityNotFoundError' | 'TypeORMError';
}

// Error Response Body Type
export interface ErrorResponseBody {
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    error: string;
    message: string;
    details?: unknown;
    stack?: string;
    detailCode?: string;
}

// Exception Types Enum
export enum ExceptionType {
    HTTP_EXCEPTION = 'HttpException',
    QUERY_FAILED_ERROR = 'QueryFailedError',
    ENTITY_NOT_FOUND_ERROR = 'EntityNotFoundError',
    TYPEORM_ERROR = 'TypeORMError',
    REFRESH_TOKEN_EXCEPTION = 'RefreshTokenException',
    VALIDATION_ERROR = 'ValidationError',
    NOT_FOUND_ERROR = 'NotFoundError',
    FORBIDDEN_ERROR = 'ForbiddenError',
    TODO_FETCH_ERROR = 'TodoFetchError',
    UNKNOWN_ERROR = 'UnknownError'
}

// Error Status Mapping
export interface ErrorStatusMapping {
    [ExceptionType.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST;
    [ExceptionType.NOT_FOUND_ERROR]: HttpStatus.NOT_FOUND;
    [ExceptionType.FORBIDDEN_ERROR]: HttpStatus.FORBIDDEN;
    [ExceptionType.TODO_FETCH_ERROR]: HttpStatus.BAD_REQUEST;
    [ExceptionType.QUERY_FAILED_ERROR]: HttpStatus.BAD_REQUEST;
    [ExceptionType.ENTITY_NOT_FOUND_ERROR]: HttpStatus.NOT_FOUND;
    [ExceptionType.TYPEORM_ERROR]: HttpStatus.BAD_REQUEST;
    [ExceptionType.REFRESH_TOKEN_EXCEPTION]: HttpStatus.BAD_REQUEST;
}

// Exception Handler Context
export interface ExceptionHandlerContext {
    status: number;
    message: string;
    error: ExceptionType;
    details: unknown;
    detailCode: string;
}

// Request Context Type
export interface RequestContext {
    method: string;
    url: string;
    path: string;
}

// Logger Context Type
export interface LoggerContext {
    method: string;
    url: string;
    status: number;
    message: string;
    stack?: string;
}

// Environment Configuration Type
export interface ExceptionFilterConfig {
    includeStack: boolean;
    environment: 'development' | 'production' | 'test';
}

// Generic Exception Handler Function Type
export type ExceptionHandler<T extends Error = Error> = (
    exception: T,
    context: ExceptionHandlerContext
) => ExceptionHandlerContext;

// Exception Filter Options
export interface ExceptionFilterOptions {
    includeStack?: boolean;
    logLevel?: 'error' | 'warn' | 'info' | 'debug';
    customErrorHandlers?: Map<string, ExceptionHandler>;
} 