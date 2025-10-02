# Authorization Check in Todo System

## Overview

The system has been updated to ensure users can only operate on their own todos. There are 2 layers of protection:

### 1. TodoOwnershipGuard
- **Location**: `src/guards/todo-ownership.guard.ts`
- **Function**: Check todo ownership permissions before allowing operations
- **How it works**: 
  - Get todoId from request params
  - Find todo in database
  - Compare todo's userId with current user
  - If not match → throw ForbiddenException

### 2. Service-level Authorization
- **Location**: `src/services/todo.service.ts`
- **Function**: Check authorization in each method
- **Protected methods**:
  - `getTodo(id, userId?)`
  - `updateTodo(id, updateTodoDto, userId?)`
  - `deleteTodo(id, userId?)`

## Usage

### In Controller
```typescript
@Get(':id')
@UseGuards(AuthGuard, TodoOwnershipGuard)  // Use both guards
async getTodo(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.todoService.getTodo(id, req.user.sub);  // Pass userId
}
```

### In Service
```typescript
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
```

## Benefits

1. **High Security**: 2 layers of checks ensure users cannot access others' todos
2. **Flexibility**: Can enable/disable guard per endpoint
3. **Easy Maintenance**: Authorization logic centralized in guard and service
4. **Performance**: Early check in guard, avoid unnecessary service calls

## Error Messages

- `ForbiddenException`: "You can only access your own todos"
- `NotFoundException`: "Todo not found"

## Testing

To test authorization:
1. Login with user A
2. Create todo with user A
3. Login with user B
4. Try to access user A's todo → Will receive ForbiddenException
