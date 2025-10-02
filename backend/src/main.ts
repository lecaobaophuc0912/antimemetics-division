import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { join } from 'path';
import { getCorsConfigFromEnv } from './config/cors.environment';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            errorHttpStatusCode: 422,
        }),
    );

    // Cấu hình CORS với nhiều domain
    const configService = app.get(ConfigService);
    const corsConfig = getCorsConfigFromEnv(configService);
    app.enableCors(corsConfig);
    app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
    console.log('PORT', configService.get('PORT'));
    await app.listen(configService.get('PORT') ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
