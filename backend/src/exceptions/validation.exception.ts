import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
    constructor(message: string) {
        super({
            statusCode: 400,
            message: message,
            error: 'Bad Request',
        });
    }
} 