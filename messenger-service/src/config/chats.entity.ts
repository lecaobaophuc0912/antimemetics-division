import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
