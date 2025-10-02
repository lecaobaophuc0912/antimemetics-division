import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { Todo } from './todo.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @Index()
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 50, default: 'user' })
    role: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Index()
    phone: string | null;

    @Column({ type: 'varchar', length: 512, nullable: true })
    avatarUrl: string | null;

    @Column({ type: 'bytea', nullable: true })
    avatarData: Buffer | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    avatarMimeType: string | null;

    @Column({ type: 'integer', nullable: true })
    avatarSize: number | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Todo, (todo) => todo.userId)
    todos: Todo[];

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];
}
