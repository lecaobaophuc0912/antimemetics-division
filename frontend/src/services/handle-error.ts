import { AxiosError, AxiosResponse } from 'axios';
import {
    ExceptionType,
    ErrorResponseBody,
    ExceptionHandlerContext,
    RequestContext,
    LoggerContext,
    ExceptionFilterConfig
} from '../declaration/exception.types';

// Default configuration for error handling
const DEFAULT_CONFIG: ExceptionFilterConfig = {
    includeStack: process.env.NODE_ENV === 'development',
    environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development'
};

/**
 * Extract error message from axios error response
 * @param error - Axios error object
 * @returns Error message string
 */
export const getMessage = (error: AxiosError): string => {
    const responseData = error.response?.data as ErrorResponseBody;
    if (responseData?.message) {
        return responseData.message;
    }

    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred';
};

/**
 * Extract error details from axios error response
 * @param error - Axios error object
 * @returns Error details object
 */
export const getErrorDetails = (error: AxiosError): unknown => {
    const responseData = error.response?.data as ErrorResponseBody;
    if (responseData?.details) {
        return responseData.details;
    }

    return null;
};

/**
 * Extract error code from axios error response
 * @param error - Axios error object
 * @returns Error code string or undefined
 */
export const getErrorDetailCode = (error: AxiosError): string | undefined => {
    const responseData = error.response?.data as ErrorResponseBody;
    return responseData?.detailCode;
};

/**
 * Get HTTP status code from axios error
 * @param error - Axios error object
 * @returns HTTP status code
 */
export const getStatusCode = (error: AxiosError): number => {
    return error.response?.status || 500;
};

/**
 * Check if error is a specific exception type
 * @param error - Axios error object
 * @param exceptionType - Exception type to check
 * @returns boolean indicating if error matches the exception type
 */
export const isExceptionType = (error: AxiosError, exceptionType: ExceptionType): boolean => {
    const errorCode = getErrorDetailCode(error);
    const statusCode = getStatusCode(error);

    const responseData = error.response?.data as ErrorResponseBody;

    switch (exceptionType) {
        case ExceptionType.REFRESH_TOKEN_EXCEPTION:
            return errorCode === 'REFRESH_TOKEN_INVALID';

        case ExceptionType.VALIDATION_ERROR:
            return statusCode === 400 && responseData?.error === 'Bad Request';

        case ExceptionType.NOT_FOUND_ERROR:
            return statusCode === 404;

        case ExceptionType.FORBIDDEN_ERROR:
            return statusCode === 403;

        case ExceptionType.UNAUTHORIZED_ERROR:
            return statusCode === 401;

        case ExceptionType.TODO_FETCH_ERROR:
            return errorCode === 'TODO_FETCH_ERROR';

        case ExceptionType.QUERY_FAILED_ERROR:
            return responseData?.error === 'QueryFailedError';

        case ExceptionType.ENTITY_NOT_FOUND_ERROR:
            return responseData?.error === 'EntityNotFoundError';

        case ExceptionType.TYPEORM_ERROR:
            return responseData?.error === 'TypeORMError';

        default:
            return false;
    }
};

/**
 * Create exception handler context from axios error
 * @param error - Axios error object
 * @param requestContext - Optional request context
 * @returns ExceptionHandlerContext object
 */
export const createExceptionContext = (
    error: AxiosError,
    requestContext?: RequestContext
): ExceptionHandlerContext => {
    const status = getStatusCode(error);
    const message = getMessage(error);
    const details = getErrorDetails(error);
    const detailCode = getErrorDetailCode(error) || 'UNKNOWN_ERROR';

    // Determine error type based on response
    let errorType = ExceptionType.UNKNOWN_ERROR;

    if (isExceptionType(error, ExceptionType.REFRESH_TOKEN_EXCEPTION)) {
        errorType = ExceptionType.REFRESH_TOKEN_EXCEPTION;
    } else if (isExceptionType(error, ExceptionType.VALIDATION_ERROR)) {
        errorType = ExceptionType.VALIDATION_ERROR;
    } else if (isExceptionType(error, ExceptionType.NOT_FOUND_ERROR)) {
        errorType = ExceptionType.NOT_FOUND_ERROR;
    } else if (isExceptionType(error, ExceptionType.FORBIDDEN_ERROR)) {
        errorType = ExceptionType.FORBIDDEN_ERROR;
    } else if (isExceptionType(error, ExceptionType.QUERY_FAILED_ERROR)) {
        errorType = ExceptionType.QUERY_FAILED_ERROR;
    } else if (isExceptionType(error, ExceptionType.ENTITY_NOT_FOUND_ERROR)) {
        errorType = ExceptionType.ENTITY_NOT_FOUND_ERROR;
    } else if (isExceptionType(error, ExceptionType.TYPEORM_ERROR)) {
        errorType = ExceptionType.TYPEORM_ERROR;
    }

    return {
        status,
        message,
        error: errorType,
        details,
        detailCode
    };
};

/**
 * Create logger context from axios error
 * @param error - Axios error object
 * @param requestContext - Request context
 * @returns LoggerContext object
 */
export const createLoggerContext = (
    error: AxiosError,
    requestContext: RequestContext
): LoggerContext => {
    return {
        method: requestContext.method,
        url: requestContext.url,
        status: getStatusCode(error),
        message: getMessage(error),
        stack: error.stack
    };
};

/**
 * Create error response body from axios error
 * @param error - Axios error object
 * @param requestContext - Request context
 * @param config - Exception filter configuration
 * @returns ErrorResponseBody object
 */
export const createErrorResponseBody = (
    error: AxiosError,
    requestContext: RequestContext,
    config: ExceptionFilterConfig = DEFAULT_CONFIG
): ErrorResponseBody => {
    const status = getStatusCode(error);
    const message = getMessage(error);
    const details = getErrorDetails(error);
    const detailCode = getErrorDetailCode(error);

    const responseData = error.response?.data as ErrorResponseBody;

    return {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: requestContext.path,
        method: requestContext.method,
        error: responseData?.error || 'Internal Server Error',
        message,
        details: config.includeStack ? details : undefined,
        stack: config.includeStack ? error.stack : undefined,
        detailCode
    };
};

/**
 * Handle axios error with custom error handlers
 * @param error - Axios error object
 * @param requestContext - Request context
 * @param customHandlers - Custom error handlers
 * @param config - Exception filter configuration
 * @returns Processed error response
 */
export const handleAxiosError = (
    error: AxiosError,
    requestContext: RequestContext,
    customHandlers?: Map<string, (error: AxiosError, context: ExceptionHandlerContext) => void>,
    config: ExceptionFilterConfig = DEFAULT_CONFIG
): ErrorResponseBody => {
    const exceptionContext = createExceptionContext(error, requestContext);
    const loggerContext = createLoggerContext(error, requestContext);

    // Log the error
    console.error('Axios Error:', loggerContext);

    // Execute custom handlers if provided
    if (customHandlers) {
        const handler = customHandlers.get(exceptionContext.error);
        if (handler) {
            handler(error, exceptionContext);
        }
    }

    // Create error response body
    const errorResponse = createErrorResponseBody(error, requestContext, config);

    return errorResponse;
};

/**
 * Check if error is a network error (no response)
 * @param error - Axios error object
 * @returns boolean indicating if it's a network error
 */
export const isNetworkError = (error: AxiosError): boolean => {
    return !error.response && error.request;
};

/**
 * Check if error is a timeout error
 * @param error - Axios error object
 * @returns boolean indicating if it's a timeout error
 */
export const isTimeoutError = (error: AxiosError): boolean => {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout');
};

/**
 * Get user-friendly error message based on error type
 * @param error - Axios error object
 * @returns User-friendly error message
 */
export const getUserFriendlyMessage = (error: AxiosError): string => {
    if (isNetworkError(error)) {
        return 'Network connection failed. Please check your internet connection.';
    }

    if (isTimeoutError(error)) {
        return 'Request timed out. Please try again.';
    }

    if (isExceptionType(error, ExceptionType.VALIDATION_ERROR)) {
        return 'Please check your input and try again.';
    }

    if (isExceptionType(error, ExceptionType.NOT_FOUND_ERROR)) {
        return 'The requested resource was not found.';
    }

    if (isExceptionType(error, ExceptionType.FORBIDDEN_ERROR)) {
        return 'You do not have permission to access this resource.';
    }

    if (isExceptionType(error, ExceptionType.REFRESH_TOKEN_EXCEPTION)) {
        return 'Your session has expired. Please log in again.';
    }

    return getMessage(error);
};

/**
 * Create a standardized error object for frontend consumption
 * @param error - Axios error object
 * @param requestContext - Request context
 * @returns Standardized error object
 */
export const createStandardizedError = (
    error: AxiosError,
    requestContext?: RequestContext
) => {
    return {
        message: getUserFriendlyMessage(error),
        technicalMessage: getMessage(error),
        statusCode: getStatusCode(error),
        errorCode: getErrorDetailCode(error),
        details: getErrorDetails(error),
        isNetworkError: isNetworkError(error),
        isTimeoutError: isTimeoutError(error),
        exceptionType: createExceptionContext(error, requestContext).error,
        timestamp: new Date().toISOString(),
        requestContext
    };
};

/**
 * Retry configuration for failed requests
 */
export interface RetryConfig {
    maxRetries: number;
    retryDelay: number;
    retryCondition: (error: AxiosError) => boolean;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryCondition: (error: AxiosError) => {
        return isNetworkError(error) ||
            isTimeoutError(error) ||
            getStatusCode(error) >= 500;
    }
};

/**
 * Check if error should be retried based on retry configuration
 * @param error - Axios error object
 * @param retryConfig - Retry configuration
 * @returns boolean indicating if request should be retried
 */
export const shouldRetry = (error: AxiosError, retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG): boolean => {
    return retryConfig.retryCondition(error);
};
