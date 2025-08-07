import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RefreshTokenException } from 'src/exceptions/refresh-token.exception';
import { QueryFailedError, EntityNotFoundError, TypeORMError } from 'typeorm';
import type {
    ErrorResponseBody,
    ExceptionHandlerContext,
    RequestContext,
    LoggerContext,
    HttpExceptionResponse,
    ExceptionFilterOptions,
} from '../types/exception.types';
import { ExceptionType } from '../types/exception.types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
    private readonly options: ExceptionFilterOptions;

    constructor(options?: ExceptionFilterOptions) {
        this.options = {
            includeStack: process.env.NODE_ENV === 'development',
            logLevel: 'error',
            ...options,
        };
    }

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const requestContext: RequestContext = {
            method: request.method,
            url: request.url,
            path: request.url,
        };

        const handlerContext = this.handleException(exception);
        this.logError(exception, handlerContext, requestContext);
        this.sendResponse(response, handlerContext, exception);
    }

    private handleException(
        exception: unknown
    ): ExceptionHandlerContext {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error: ExceptionType = ExceptionType.UNKNOWN_ERROR;
        let details: unknown = null;
        let detailCode: string = '';

        console.log('exception', exception);

        // Handle different types of exceptions
        if (exception instanceof HttpException) {
            const exceptionContext = this.handleHttpException(exception);
            status = exceptionContext.status;
            message = exceptionContext.message;
            error = exceptionContext.error;
            details = exceptionContext.details;
            detailCode = exceptionContext.detailCode;
        } else if (exception instanceof QueryFailedError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Database query failed';
            error = ExceptionType.QUERY_FAILED_ERROR;
        } else if (exception instanceof EntityNotFoundError) {
            status = HttpStatus.NOT_FOUND;
            message = 'Entity not found';
            error = ExceptionType.ENTITY_NOT_FOUND_ERROR;
        } else if (exception instanceof TypeORMError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Database operation failed';
            error = ExceptionType.TYPEORM_ERROR;
        } else if (exception instanceof RefreshTokenException) {
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
            error = ExceptionType.REFRESH_TOKEN_EXCEPTION;
        } else if (exception instanceof Error) {
            const errorContext = this.handleGenericError(exception);
            status = errorContext.status;
            message = errorContext.message;
            error = errorContext.error;
        }

        return {
            status,
            message,
            error,
            details,
            detailCode,
        };
    }

    private handleHttpException(exception: HttpException): ExceptionHandlerContext {
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as HttpExceptionResponse;

        let message: string;
        let details: unknown = null;
        const detailCode = exceptionResponse.code || '';

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object') {
            message = exceptionResponse.message || exception.message;
            details = exceptionResponse.details || exceptionResponse.errors;
        } else {
            message = exception.message;
        }

        return {
            status,
            message,
            error: ExceptionType.HTTP_EXCEPTION,
            details,
            detailCode,
        };
    }

    private handleGenericError(exception: Error): ExceptionHandlerContext {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let error: ExceptionType = ExceptionType.UNKNOWN_ERROR;

        if (exception.message.includes('validation') || exception.message.includes('Invalid')) {
            status = HttpStatus.BAD_REQUEST;
            error = ExceptionType.VALIDATION_ERROR;
        } else if (exception.message.includes('not found')) {
            status = HttpStatus.NOT_FOUND;
            error = ExceptionType.NOT_FOUND_ERROR;
        } else if (exception.message.includes('forbidden') || exception.message.includes('unauthorized')) {
            status = HttpStatus.FORBIDDEN;
            error = ExceptionType.FORBIDDEN_ERROR;
        } else if (exception.message.includes('Failed to fetch todos')) {
            status = HttpStatus.BAD_REQUEST;
            error = ExceptionType.TODO_FETCH_ERROR;
        }

        return {
            status,
            message: exception.message,
            error,
            details: null,
            detailCode: '',
        };
    }

    private logError(
        exception: unknown,
        handlerContext: ExceptionHandlerContext,
        requestContext: RequestContext
    ): void {
        const loggerContext: LoggerContext = {
            method: requestContext.method,
            url: requestContext.url,
            status: handlerContext.status,
            message: handlerContext.message,
            stack: exception instanceof Error ? exception.stack : undefined,
        };

        this.logger.error(
            `${loggerContext.method} ${loggerContext.url} - ${loggerContext.status} - ${loggerContext.message}`,
            loggerContext.stack || 'Unknown error',
        );
    }

    private sendResponse(
        response: Response,
        handlerContext: ExceptionHandlerContext,
        exception: unknown
    ): void {
        const responseBody: ErrorResponseBody = {
            statusCode: handlerContext.status,
            timestamp: new Date().toISOString(),
            path: response.req.url,
            method: response.req.method,
            error: handlerContext.error,
            message: handlerContext.message,
            detailCode: handlerContext.detailCode,
        };

        if (handlerContext.details) {
            responseBody.details = handlerContext.details;
        }

        if (this.options.includeStack && exception instanceof Error) {
            responseBody.stack = exception.stack;
        }

        response.status(handlerContext.status).json(responseBody);
    }
} 