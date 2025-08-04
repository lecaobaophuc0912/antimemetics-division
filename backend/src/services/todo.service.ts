import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo, TodoPriority, TodoStatus } from "src/config/todo.entity";
import { TodoDto } from "src/dto/todo.dto";
import { TodoQueryDto } from "src/dto/todo-query.dto";
import { Repository, DataSource, Like, Between } from "typeorm";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
        private dataSource: DataSource,
    ) { }

    async createTodo(createTodoDto: TodoDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Tạo code tự động
            const lastTodos = await queryRunner.manager.find(Todo, {
                order: { id: 'DESC' },
                take: 1
            });

            const lastTodo = lastTodos[0];
            const nextNumber = lastTodo ? parseInt(lastTodo.code.split('-')[1]) + 1 : 1;
            const code = `TODO-${nextNumber.toString().padStart(3, '0')}`;

            const todo = queryRunner.manager.create(Todo, {
                code,
                title: createTodoDto.title,
                description: createTodoDto.description,
                status: createTodoDto.status as any,
                priority: createTodoDto.priority as any,
                dueDate: createTodoDto.dueDate,
                userId: { id: createTodoDto.userId } as any
            });

            const savedTodo = await queryRunner.manager.save(todo);

            await queryRunner.commitTransaction();
            return savedTodo;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // Cách 2: Sử dụng QueryBuilder với search và filter
    async getTodosByUser(userId: string, query: TodoQueryDto) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                status,
                priority,
                dueDateFrom,
                dueDateTo,
                sortBy = 'id',
                sortOrder = 'DESC'
            } = query;

            const queryBuilder = this.todoRepository
                .createQueryBuilder('todo')
                .leftJoinAndSelect('todo.userId', 'user', 'user.id = :userId', { userId });

            // Search functionality
            if (search) {
                queryBuilder.andWhere(
                    '(todo.title LIKE :search OR todo.description LIKE :search OR todo.code LIKE :search)',
                    { search: `%${search}%` }
                );
            }

            // Filter by status
            if (status) {
                queryBuilder.andWhere('todo.status = :status', { status });
            }

            // Filter by priority
            if (priority) {
                queryBuilder.andWhere('todo.priority = :priority', { priority });
            }

            // Filter by due date range
            if (dueDateFrom || dueDateTo) {
                if (dueDateFrom && dueDateTo) {
                    queryBuilder.andWhere('todo.dueDate BETWEEN :dueDateFrom AND :dueDateTo', {
                        dueDateFrom,
                        dueDateTo
                    });
                } else if (dueDateFrom) {
                    queryBuilder.andWhere('todo.dueDate >= :dueDateFrom', {
                        dueDateFrom
                    });
                } else if (dueDateTo) {
                    queryBuilder.andWhere('todo.dueDate <= :dueDateTo', {
                        dueDateTo
                    });
                }
            }

            // Sorting
            const validSortFields = ['id', 'title', 'status', 'priority', 'dueDate', 'createdAt', 'updatedAt'];
            const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
            queryBuilder.orderBy(`todo.${sortField}`, sortOrder as 'ASC' | 'DESC');

            // Pagination
            queryBuilder.skip((page - 1) * limit).take(limit);

            const [todos, total] = await queryBuilder.getManyAndCount();

            return {
                data: todos,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                filters: {
                    search,
                    status,
                    priority,
                    dueDateFrom,
                    dueDateTo,
                    sortBy: sortField,
                    sortOrder
                }
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch todos: ${error.message}`);
            }
            throw new Error('Failed to fetch todos');
        }
    }

    async getTodo(id: string, userId?: string) {
        const todo = await this.todoRepository.findOne({
            where: { id },
            relations: ['userId']
        });

        if (!todo) {
            throw new NotFoundException('Todo not found');
        }

        // Authorization check
        if (userId && todo.userId.id !== userId) {
            throw new ForbiddenException('You can only access your own todos');
        }

        return todo;
    }

    async updateTodo(id: string, updateTodoDto: TodoDto, userId?: string) {
        const todo = await this.todoRepository.findOne({
            where: { id },
            relations: ['userId']
        });

        if (!todo) {
            throw new NotFoundException('Todo not found');
        }

        // Authorization check
        if (userId && todo.userId.id !== userId) {
            throw new ForbiddenException('You can only update your own todos');
        }

        const { userId: dtoUserId, ...updateData } = updateTodoDto;

        return this.todoRepository.update(id, {
            ...updateData,
            status: updateData.status as TodoStatus,
            priority: updateData.priority as TodoPriority,
            dueDate: new Date(updateData.dueDate)
        });
    }

    async deleteTodo(id: string, userId?: string) {
        const todo = await this.todoRepository.findOne({
            where: { id },
            relations: ['userId']
        });

        if (!todo) {
            throw new NotFoundException('Todo not found');
        }

        // Authorization check
        if (userId && todo.userId.id !== userId) {
            throw new ForbiddenException('You can only delete your own todos');
        }

        return this.todoRepository.softDelete(id);
    }

    async getTodoStats(userId: string) {
        const statusStats = await this.todoRepository
            .createQueryBuilder('todo')
            .select('todo.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('todo.userId.id = :userId', { userId })
            .groupBy('todo.status')
            .getRawMany();

        const priorityStats = await this.todoRepository
            .createQueryBuilder('todo')
            .select('todo.priority', 'priority')
            .addSelect('COUNT(*)', 'count')
            .where('todo.userId.id = :userId', { userId })
            .groupBy('todo.priority')
            .getRawMany();

        const totalTodos = await this.todoRepository
            .createQueryBuilder('todo')
            .where('todo.userId.id = :userId', { userId })
            .getCount();

        const overdueTodos = await this.todoRepository
            .createQueryBuilder('todo')
            .where('todo.userId.id = :userId', { userId })
            .andWhere('todo.dueDate < :now', { now: new Date() })
            .andWhere('todo.status = :status', { status: TodoStatus.PENDING })
            .getCount();

        return {
            total: totalTodos,
            overdue: overdueTodos,
            byStatus: statusStats,
            byPriority: priorityStats
        };
    }
}