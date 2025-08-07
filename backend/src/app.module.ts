import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './config/user.entity';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TodoService } from './services/todo.service';
import { Todo } from './config/todo.entity';
import { TodoController } from './controllers/todo.controller';
import { TodoOwnershipGuard } from './guards/todo-ownership.guard';
import { RefreshToken } from './config/refresh-token.entity';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Để các module khác đều dùng được
        }),
        TypeOrmModule.forRoot(databaseConfig),
        TypeOrmModule.forFeature([User, Todo, RefreshToken]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRES_IN'),
                },
            }),
        }),
    ],
    controllers: [AppController, AuthController, TodoController],
    providers: [
        AppService,
        AuthService,
        TodoService,
        TodoOwnershipGuard,
        LoggingInterceptor,
    ],
})
export class AppModule { }
