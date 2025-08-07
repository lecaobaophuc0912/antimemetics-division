import { HttpException, HttpStatus } from '@nestjs/common';

export class RefreshTokenException extends HttpException {
    constructor(message: string = 'Invalid refresh token') {
        super(
            {
                statusCode: HttpStatus.UNAUTHORIZED,
                message,
                error: 'RefreshTokenError',
                code: 'REFRESH_TOKEN_INVALID' // Custom code để client phân biệt
            },
            HttpStatus.UNAUTHORIZED
        );
    }
} 