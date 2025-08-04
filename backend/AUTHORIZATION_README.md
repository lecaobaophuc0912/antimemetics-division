# Authorization Check trong Todo System

## Tổng quan

Hệ thống đã được cập nhật để đảm bảo user chỉ có thể thao tác với todos của mình. Có 2 lớp bảo vệ:

### 1. TodoOwnershipGuard
- **Vị trí**: `src/guards/todo-ownership.guard.ts`
- **Chức năng**: Kiểm tra quyền sở hữu todo trước khi cho phép thao tác
- **Cách hoạt động**: 
  - Lấy todoId từ request params
  - Tìm todo trong database
  - So sánh userId của todo với user hiện tại
  - Nếu không khớp → throw ForbiddenException

### 2. Service-level Authorization
- **Vị trí**: `src/services/todo.service.ts`
- **Chức năng**: Kiểm tra authorization trong từng method
- **Các method được bảo vệ**:
  - `getTodo(id, userId?)`
  - `updateTodo(id, updateTodoDto, userId?)`
  - `deleteTodo(id, userId?)`

## Cách sử dụng

### Trong Controller
```typescript
@Get(':id')
@UseGuards(AuthGuard, TodoOwnershipGuard)  // Sử dụng cả 2 guards
async getTodo(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.todoService.getTodo(id, req.user.sub);  // Truyền userId
}
```

### Trong Service
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

## Lợi ích

1. **Bảo mật cao**: 2 lớp kiểm tra đảm bảo user không thể truy cập todos của người khác
2. **Linh hoạt**: Có thể bật/tắt guard tùy theo endpoint
3. **Dễ maintain**: Logic authorization tập trung trong guard và service
4. **Performance**: Kiểm tra sớm trong guard, tránh gọi service không cần thiết

## Error Messages

- `ForbiddenException`: "You can only access your own todos"
- `NotFoundException`: "Todo not found"

## Testing

Để test authorization:
1. Login với user A
2. Tạo todo với user A
3. Login với user B
4. Thử truy cập todo của user A → Sẽ nhận ForbiddenException 