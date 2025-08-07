import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'messenger',
        protoPath: [
          join(__dirname, 'proto/messenger.proto'),
          join(__dirname, 'proto/hello.proto'),
        ],
        url: `0.0.0.0:${process.env.MESSENGER_PORT ?? 5002}`,
      },
    },
  );

  // Global exception filter

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 422,
    }),
  );

  await app.listen();
}
bootstrap();
