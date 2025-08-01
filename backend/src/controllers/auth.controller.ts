import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { LoginDto } from "src/dto/login.dto";
import { RegisterDto } from "src/dto/user.dto";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { TransformInterceptor } from "src/interceptors/transform.interceptor";
import { AuthService } from "src/services/auth.service";

@Controller('auth')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
