import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors, UploadedFile } from "@nestjs/common";
import { LoginDto } from "src/dto/login.dto";
import { RegisterDto, UserRequest } from "src/dto/user.dto";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { TransformInterceptor } from "src/interceptors/transform.interceptor";
import { AuthService } from "src/services/auth.service";
import type { Request, Response, Express, CookieOptions } from 'express';
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ImageService } from "src/services/image.service";
import { ConfigService } from "@nestjs/config";

@Controller('auth')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AuthController {
    private cookieOptions: CookieOptions;

    constructor(
        private readonly authService: AuthService,
        private readonly imageService: ImageService,
        private readonly configService: ConfigService
    ) {
        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
        this.cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: isProduction ? 'strict' : 'none',
            maxAge: parseInt(this.configService.get<string>('COOKIE_MAX_AGE') || '2592000000'), // 30 days
            path: '/',
        };
    }

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.login(loginDto);
        res.cookie('refreshToken', result.refreshToken, this.cookieOptions);
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
        res.cookie('refreshToken', result.refreshToken, this.cookieOptions);

        return {
            accessToken: result.accessToken,
            message: 'Refresh token successfully'
        };
    }

    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken: string = req.cookies?.refreshToken as string;
        if (!refreshToken) {
            return { message: 'No refresh token provided' };
        }
        await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken', this.cookieOptions);

        return { message: 'Logged out successfully' };
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    async profile(@Req() req: Request & { user: UserRequest }) {
        const user = await this.authService.getUserProfile(req.user.sub);
        return user;
    }

    @Post('avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = join(process.cwd(), 'uploads', 'avatars');
                    fs.mkdirSync(uploadDir, { recursive: true });
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
            fileFilter: (req, file, cb) => {
                const allowed = ['image/jpeg', 'image/png', 'image/webp'];
                if (!allowed.includes(file.mimetype)) {
                    return cb(new UnauthorizedException('Invalid file type'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request & { user: UserRequest },
    ) {
        if (!file) {
            throw new UnauthorizedException('No file uploaded');
        }
        const relativePath = `/uploads/avatars/${file.filename}`;
        await this.authService.updateUserAvatar(req.user.sub, relativePath);
        return { avatarUrl: relativePath };
    }

    @Post('avatar-binary')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('avatar'),
    )
    async uploadAvatarBinary(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request & { user: UserRequest },
    ) {
        if (!file) {
            throw new UnauthorizedException('No file uploaded');
        }

        // Validate image file
        this.imageService.validateImageFile(file);

        // Process and optimize image for storage
        const processedImage = await this.imageService.processImageForStorage(
            file.buffer,
            {
                maxWidth: 300,
                maxHeight: 300,
                quality: 80,
                format: 'jpeg',
                maxSizeBytes: 1024 * 1024, // 1MB
            }
        );

        // Store in database
        const result = await this.authService.updateUserAvatarBinary(
            req.user.sub,
            processedImage.buffer,
            processedImage.mimeType,
            processedImage.size
        );

        return {
            avatarUrl: this.imageService.imageToBase64(processedImage.buffer, processedImage.mimeType)
        };
    }

    @Get('avatar-binary/:userId')
    async getAvatarBinary(@Req() req: Request, @Res() res: Response) {
        const userId = req.params.userId;

        try {
            const avatarData = await this.authService.getUserAvatarBinary(userId);

            if (!avatarData.avatarData) {
                return res.status(404).json({ message: 'Avatar not found' });
            }

            // Set appropriate headers
            res.set({
                'Content-Type': avatarData.mimeType || 'image/jpeg',
                'Content-Length': (avatarData.size || 0).toString(),
                'Cache-Control': 'public, max-age=31536000', // 1 year cache
            });

            // Send binary data
            res.send(avatarData.avatarData);
        } catch (error) {
            res.status(404).json({ message: 'Avatar not found' });
        }
    }
}
