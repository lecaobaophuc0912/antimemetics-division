import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from './guards/auth.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Controller('api')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('AppController constructor');
  }
}
