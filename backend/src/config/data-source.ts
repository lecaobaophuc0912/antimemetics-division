import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Todo } from './todo.entity';
import { RefreshToken } from './refresh-token.entity';
import * as dotenv from 'dotenv';

if (
    !process.env.POSTGRES_DB ||
    !process.env.POSTGRES_HOST ||
    !process.env.POSTGRES_PORT ||
    !process.env.POSTGRES_USER ||
    !process.env.POSTGRES_PASSWORD ||
    !process.env.POSTGRES_DB
) {
    dotenv.config();
}
console.log('process.env.POSTGRES_DB', process.env.POSTGRES_DB);
const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || ''),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [User, Todo, RefreshToken],
    migrations: [__dirname + '/../migrations/*.ts'],
    synchronize: false,
    logging: false,
});

export default AppDataSource;
