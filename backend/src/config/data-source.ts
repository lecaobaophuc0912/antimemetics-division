import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Todo } from './todo.entity';
import { RefreshToken } from './refresh-token.entity';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432') || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres123',
    database: process.env.POSTGRES_DB || 'nextjs_nestjs_db',
    entities: [User, Todo, RefreshToken],
    migrations: [__dirname + '/../migrations/*.ts'],
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
});

export default AppDataSource;
