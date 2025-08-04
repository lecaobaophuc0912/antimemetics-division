# Todo Search & Filter API Documentation

## Overview
Backend đã được cập nhật với các chức năng search và filter mạnh mẽ cho todo API.

## API Endpoints

### 1. Get Todos với Search/Filter
```
GET /todo?search=keyword&status=pending&priority=high&page=1&limit=10
```

#### Query Parameters:
- `search` (optional): Tìm kiếm theo title, description, hoặc code
- `status` (optional): Filter theo status (pending/completed)
- `priority` (optional): Filter theo priority (low/medium/high)
- `dueDateFrom` (optional): Filter từ ngày này
- `dueDateTo` (optional): Filter đến ngày này
- `sortBy` (optional): Sắp xếp theo field (id, title, status, priority, dueDate, createdAt, updatedAt)
- `sortOrder` (optional): Thứ tự sắp xếp (ASC/DESC)
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số item mỗi trang (default: 10, max: 100)

#### Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "TODO-001",
      "title": "Todo title",
      "description": "Todo description",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "filters": {
    "search": "keyword",
    "status": "pending",
    "priority": "high",
    "dueDateFrom": null,
    "dueDateTo": null,
    "sortBy": "id",
    "sortOrder": "DESC"
  }
}
```

### 2. Get Todo Statistics
```
GET /todo/stats
```

#### Response:
```json
{
  "total": 25,
  "overdue": 3,
  "byStatus": [
    {
      "status": "pending",
      "count": "15"
    },
    {
      "status": "completed",
      "count": "10"
    }
  ],
  "byPriority": [
    {
      "priority": "low",
      "count": "5"
    },
    {
      "priority": "medium",
      "count": "12"
    },
    {
      "priority": "high",
      "count": "8"
    }
  ]
}
```

## Ví dụ sử dụng:

### 1. Tìm kiếm todos có chứa từ "meeting"
```
GET /todo?search=meeting
```

### 2. Filter todos pending với priority high
```
GET /todo?status=pending&priority=high
```

### 3. Filter todos trong khoảng thời gian
```
GET /todo?dueDateFrom=2024-01-01&dueDateTo=2024-01-31
```

### 4. Sắp xếp theo dueDate tăng dần
```
GET /todo?sortBy=dueDate&sortOrder=ASC
```

### 5. Kết hợp nhiều filter
```
GET /todo?search=urgent&status=pending&priority=high&sortBy=dueDate&sortOrder=ASC&page=1&limit=20
```

## Features:

### Search Functionality:
- Tìm kiếm trong title, description, và code
- Sử dụng LIKE query với wildcard matching
- Case-insensitive search

### Filter Functionality:
- Filter theo status (pending/completed)
- Filter theo priority (low/medium/high)
- Filter theo due date range
- Kết hợp nhiều filter cùng lúc

### Sorting:
- Sắp xếp theo bất kỳ field nào
- Hỗ trợ ASC/DESC order
- Validation cho sort fields

### Pagination:
- Phân trang với page và limit
- Trả về thông tin pagination đầy đủ
- Limit tối đa 100 items per page

### Statistics:
- Tổng số todos
- Số todos quá hạn
- Thống kê theo status
- Thống kê theo priority 