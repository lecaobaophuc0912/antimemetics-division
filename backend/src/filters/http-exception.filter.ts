import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
    BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError, TypeORMError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        let details = null;

        // Handle different types of exceptions
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || exception.message;
                details = responseObj.details || responseObj.errors;
            } else {
                message = exception.message;
            }

            error = exception.name;
        } else if (exception instanceof QueryFailedError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Database query failed';
            error = 'QueryFailedError';
        } else if (exception instanceof EntityNotFoundError) {
            status = HttpStatus.NOT_FOUND;
            message = 'Entity not found';
            error = 'EntityNotFoundError';
        } else if (exception instanceof TypeORMError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Database operation failed';
            error = 'TypeORMError';
        } else if (exception instanceof Error) {
            // Handle specific error messages
            if (exception.message.includes('validation') || exception.message.includes('Invalid')) {
                status = HttpStatus.BAD_REQUEST;
                message = exception.message;
                error = 'ValidationError';
            } else if (exception.message.includes('not found')) {
                status = HttpStatus.NOT_FOUND;
                message = exception.message;
                error = 'NotFoundError';
            } else if (exception.message.includes('forbidden') || exception.message.includes('unauthorized')) {
                status = HttpStatus.FORBIDDEN;
                message = exception.message;
                error = 'ForbiddenError';
            } else if (exception.message.includes('Failed to fetch todos')) {
                status = HttpStatus.BAD_REQUEST;
                message = exception.message;
                error = 'TodoFetchError';
            }
        }

        // Log the error
        this.logger.error(
            `${request.method} ${request.url} - ${status} - ${message}`,
            exception instanceof Error ? exception.stack : 'Unknown error',
        );

        // Send response
        const responseBody: any = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error: error,
            message: message,
        };

        if (details) {
            responseBody.details = details;
        }

        if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
            responseBody.stack = exception.stack;
        }

        response.status(status).json(responseBody);
    }
} 