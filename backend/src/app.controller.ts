import {
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Controller('api')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('AppController constructor');
  }
}
