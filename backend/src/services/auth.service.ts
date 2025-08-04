import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { LoginDto, LoginResponseDto } from "src/dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "src/dto/user.dto";
import { Repository } from "typeorm";
import { User } from "src/config/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { RefreshToken } from "src/config/refresh-token.entity";
import { RefreshTokenDto, RefreshTokenResponseDto } from "src/dto/refresh-token.dto";
import { randomBytes, createHash } from 'crypto';

export const EXPIRED_TIME_ACCESS_TOKEN = '5s';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
        private jwtService: JwtService,
    ) { }

    // Tạo refresh token
    private async createRefreshToken(userId: string): Promise<string> {
        const token = randomBytes(20).toString('hex');
        const hashedToken = await this.hashRefreshToken(token);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 ngày

        const refreshToken = this.refreshTokenRepository.create({
            token: hashedToken,
            userId,
            expiresAt,
        });

        await this.refreshTokenRepository.save(refreshToken);
        return token;
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        try {
            // Tìm user bằng email sử dụng TypeORM
            const user = await this.userRepository.findOne({
                where: { email: loginDto.email },
                select: ['id', 'email', 'password', 'name', 'role'] // Chỉ select các field cần thiết
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // So sánh password sử dụng bcrypt
            const isPasswordValid = bcrypt.compareSync(loginDto.password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Tạo refresh token
            const refreshToken = await this.createRefreshToken(user.id);

            // Tạo JWT payload (không bao gồm password)
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role
            };

            // Tạo JWT token
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: EXPIRED_TIME_ACCESS_TOKEN,
            });

            // Trả về user info (không bao gồm password) và token
            const { password, ...userWithoutPassword } = user;

            return {
                user: userWithoutPassword,
                accessToken,
                refreshToken,
                message: 'Login successful'
            };

        } catch (error) {
            // Log error để debug (trong production nên sử dụng logger service)
            console.error('Login error:', error);

            // Re-throw các error đã được handle
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                throw error;
            }

            // Handle các error khác
            throw new UnauthorizedException('Login failed');
        }
    }

    // Method refresh token
    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        console.log(refreshTokenDto);
        const { refreshToken } = refreshTokenDto;
        const hashedToken = await this.hashRefreshToken(refreshToken);
        console.log(hashedToken);
        // Tìm refresh token trong database
        const tokenRecord = await this.refreshTokenRepository.findOne({
            where: {
                token: hashedToken,
                isRevoked: false
            },
            relations: ['user']
        });

        if (!tokenRecord) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Kiểm tra token đã hết hạn chưa
        if (tokenRecord.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token expired');
        }

        // Tạo access token mới
        const payload = {
            sub: tokenRecord.user.id,
            email: tokenRecord.user.email,
            role: tokenRecord.user.role
        };

        const newAccessToken = this.jwtService.sign(payload, {
            expiresIn: EXPIRED_TIME_ACCESS_TOKEN,
        });

        // Tạo refresh token mới (optional - có thể giữ nguyên cũ)
        const newRefreshToken = await this.createRefreshToken(tokenRecord.user.id);

        // Revoke refresh token cũ
        await this.refreshTokenRepository.update(
            { id: tokenRecord.id },
            { isRevoked: true }
        );

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            message: 'Token refreshed successfully'
        };
    }

    async logout(refreshToken: string): Promise<{ message: string }> {
        const hashedToken = await this.hashRefreshToken(refreshToken);
        console.log('hashedToken', hashedToken);
        const result = await this.refreshTokenRepository.update(
            { token: hashedToken },
            { isRevoked: true }
        );
        console.log(result);

        if (result.affected === 0) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return { message: 'Logged out successfully' };
    }

    // Thêm method để verify JWT token
    verifyToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            return payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    // Thêm method để get user profile
    async getUserProfile(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt']
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    // Method để hash password
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async hashRefreshToken(refreshToken: string): Promise<string> {
        return createHash('sha256').update(refreshToken).digest('hex');
    }

    // Method để tạo user mới (register)
    async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
        try {
            // Kiểm tra email đã tồn tại chưa
            const existingUser = await this.userRepository.findOne({
                where: { email: registerDto.email }
            });

            if (existingUser) {
                throw new UnauthorizedException('Email already exists');
            }

            // Hash password
            const hashedPassword = await this.hashPassword(registerDto.password);

            // Tạo user mới
            const newUser = this.userRepository.create({
                email: registerDto.email,
                password: hashedPassword,
                name: registerDto.name,
                role: registerDto.role || 'user'
            });

            // Lưu vào database
            const savedUser = await this.userRepository.save(newUser);

            // Trả về user info (không bao gồm password)
            const { password, ...userWithoutPassword } = savedUser;

            return {
                user: userWithoutPassword,
                message: 'User registered successfully'
            };

        } catch (error) {
            console.error('Register error:', error);

            if (error instanceof UnauthorizedException) {
                throw error;
            }

            throw new UnauthorizedException('Registration failed');
        }
    }
}
