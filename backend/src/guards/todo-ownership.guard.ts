import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { TodoService } from 'src/services/todo.service';
import { UserRequest } from 'src/dto/user.dto';

@Injectable()
export class TodoOwnershipGuard implements CanActivate {
    constructor(private readonly todoService: TodoService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as UserRequest;
        const todoId = request.params.id;

        if (!todoId) {
            return true; // Không có todoId, cho phép (create todo)
        }

        const todo = await this.todoService.getTodo(todoId);

        if (!todo) {
            throw new NotFoundException('Todo not found');
        }

        if (todo.userId.id !== user.sub) {
            throw new ForbiddenException('You can only access your own todos');
        }

        return true;
    }
} 