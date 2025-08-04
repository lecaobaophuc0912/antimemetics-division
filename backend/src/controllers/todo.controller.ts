import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { TodoRequestDto } from "src/dto/todo.dto";
import { UserRequest } from "src/dto/user.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { TodoOwnershipGuard } from "src/guards/todo-ownership.guard";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { TransformInterceptor } from "src/interceptors/transform.interceptor";
import { TodoService } from "src/services/todo.service";
import { TodoQueryDto } from "src/dto/todo-query.dto";

@Controller('todo')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Post()
    @UseGuards(AuthGuard)
    async createTodo(@Body() createTodoDto: TodoRequestDto, @Req() req: Request & { user: UserRequest }) {
        return this.todoService.createTodo({
            ...createTodoDto,
            dueDate: new Date(createTodoDto.dueDate),
            userId: req.user.sub
        });
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getTodos(
        @Req() req: Request & { user: UserRequest },
        @Query() query: TodoQueryDto
    ) {
        return this.todoService.getTodosByUser(req.user.sub, query);
    }

    @Get('stats')
    @UseGuards(AuthGuard)
    async getTodoStats(@Req() req: Request & { user: UserRequest }) {
        return this.todoService.getTodoStats(req.user.sub);
    }

    @Get(':id')
    @UseGuards(AuthGuard, TodoOwnershipGuard)
    async getTodo(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
        return this.todoService.getTodo(id, req.user.sub);
    }

    @Put(':id')
    @UseGuards(AuthGuard, TodoOwnershipGuard)
    async updateTodo(
        @Param('id') id: string,
        @Body() updateTodoDto: TodoRequestDto,
        @Req() req: Request & { user: UserRequest }
    ) {
        return this.todoService.updateTodo(id, {
            ...updateTodoDto,
            dueDate: new Date(updateTodoDto.dueDate)
        }, req.user.sub);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, TodoOwnershipGuard)
    async deleteTodo(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
        return this.todoService.deleteTodo(id, req.user.sub);
    }
}
