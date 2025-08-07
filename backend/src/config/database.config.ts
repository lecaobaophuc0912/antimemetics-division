import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

if (!process.env.POSTGRES_DB || !process.env.POSTGRES_HOST || !process.env.POSTGRES_PORT || !process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD || !process.env.POSTGRES_DB) {
    dotenv.config();
}

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || ''),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production', // Chỉ dùng trong development
    logging: false,
    autoLoadEntities: true,
};
