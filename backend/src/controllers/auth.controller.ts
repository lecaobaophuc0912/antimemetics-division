import { Body, Controller, Post, Req, Res, UnauthorizedException, UseInterceptors } from "@nestjs/common";
import { LoginDto } from "src/dto/login.dto";
import { RegisterDto, UserRequest } from "src/dto/user.dto";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { TransformInterceptor } from "src/interceptors/transform.interceptor";
import { AuthService } from "src/services/auth.service";
import type { Request, Response } from 'express';

@Controller('auth')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.login(loginDto);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: parseInt(process.env.COOKIE_MAX_AGE || '2592000000'), // 30 days
        });
        return result;
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('refresh-token')
    async refreshToken(
        @Req() req: Request & { user: UserRequest },
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken: string = req.cookies?.refreshToken as string;

        const result = await this.authService.refreshToken({
            refreshToken
        });
        if (!result) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: parseInt(process.env.COOKIE_MAX_AGE || '2592000000'), // 30 days
        });

        return {
            accessToken: result.accessToken,
            message: 'Refresh token successfully'
        };
    }

    @Post('logout')
    async logout(
        @Req() req: Request & { user: UserRequest },
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken: string = req.cookies?.refreshToken as string;
        await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        return { message: 'Logged out successfully' };
    }
}
