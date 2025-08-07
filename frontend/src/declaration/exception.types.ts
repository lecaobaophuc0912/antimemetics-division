export declare enum HttpStatus {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLYHINTS = 103,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    MULTI_STATUS = 207,
    ALREADY_REPORTED = 208,
    CONTENT_DIFFERENT = 210,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED = 421,
    UNPROCESSABLE_ENTITY = 422,
    LOCKED = 423,
    FAILED_DEPENDENCY = 424,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    UNRECOVERABLE_ERROR = 456,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
    INSUFFICIENT_STORAGE = 507,
    LOOP_DETECTED = 508
}

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
    UNAUTHORIZED_ERROR = 'UnauthorizedError',
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