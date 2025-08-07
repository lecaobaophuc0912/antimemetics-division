import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

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

    app.enableCors({
        origin: 'http://localhost:3001',
        credentials: true, // ← Quan trọng!
    });
    const configService = app.get(ConfigService);
    console.log('PORT', configService.get('PORT'));
    await app.listen(configService.get('PORT') ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
