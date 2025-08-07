import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    get messengerPort(): number {
        return parseInt(process.env.MESSENGER_PORT || '5002');
    }

    get databaseHost(): string {
        return process.env.POSTGRES_HOST || 'localhost';
    }

    get databasePort(): number {
        return parseInt(process.env.POSTGRES_PORT || '5432');
    }

    get databaseUser(): string {
        return process.env.POSTGRES_USER || 'postgres';
    }

    get databasePassword(): string {
        return process.env.POSTGRES_PASSWORD || 'postgres123';
    }

    get databaseName(): string {
        return process.env.POSTGRES_DB || 'nextjs_nestjs_db';
    }

    get isDevelopment(): boolean {
        return process.env.NODE_ENV !== 'production';
    }

    get databaseConfig() {
        return {
            type: 'postgres' as const,
            host: this.databaseHost,
            port: this.databasePort,
            username: this.databaseUser,
            password: this.databasePassword,
            database: this.databaseName,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: this.isDevelopment,
            logging: this.isDevelopment,
            autoLoadEntities: true,
        };
    }

    get grpcConfig() {
        return {
            transport: 'grpc' as const,
            options: {
                package: 'messenger',
                protoPath: require('path').join(__dirname, '../proto/messenger.proto'),
                url: `0.0.0.0:${this.messengerPort}`,
            },
        };
    }
} 