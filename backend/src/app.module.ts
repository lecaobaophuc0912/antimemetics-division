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

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Todo, RefreshToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // Trong production nên sử dụng environment variable
      signOptions: {
        expiresIn: '24h' // Token hết hạn sau 24 giờ
      },
    }),
  ],
  controllers: [AppController, AuthController, TodoController],
  providers: [AppService, AuthService, TodoService, TodoOwnershipGuard],
})
export class AppModule { }
