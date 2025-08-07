import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    token: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ type: 'boolean', default: false })
    isRevoked: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
