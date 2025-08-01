import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { LoginDto, LoginResponseDto } from "src/dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "src/dto/user.dto";
import { Repository } from "typeorm";
import { User } from "src/config/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

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
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Tạo JWT payload (không bao gồm password)
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role
            };

            // Tạo JWT token
            const accessToken = this.jwtService.sign(payload);

            // Trả về user info (không bao gồm password) và token
            const { password, ...userWithoutPassword } = user;

            return {
                user: userWithoutPassword,
                accessToken,
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
