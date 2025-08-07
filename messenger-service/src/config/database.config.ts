import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST || 'localhost',
	port: parseInt(process.env.POSTGRES_PORT || '5432') || 5432,
	username: process.env.POSTGRES_USER || 'postgres',
	password: process.env.POSTGRES_PASSWORD || 'postgres123',
	database: process.env.POSTGRES_DB || 'nextjs_nestjs_db',
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
	synchronize: process.env.NODE_ENV !== 'production', // Chỉ dùng trong development
	logging: process.env.NODE_ENV !== 'production',
	autoLoadEntities: true,
};
