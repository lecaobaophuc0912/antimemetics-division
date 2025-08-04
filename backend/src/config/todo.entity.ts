import { Column, Entity, ForeignKey, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Generated, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { User } from "./user.entity";

export enum TodoStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
}

export enum TodoPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

@Entity('todos')
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @Generated('increment')
    code: string;

    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'enum', enum: TodoStatus })
    status: TodoStatus;

    @Column({ type: 'enum', enum: TodoPriority })
    priority: TodoPriority;

    @Column({ type: 'timestamp' })
    dueDate: Date;

    @ManyToOne(() => User, (user) => user.todos)
    @JoinColumn({ name: 'user_id' })
    userId: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
