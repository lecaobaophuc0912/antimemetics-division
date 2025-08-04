import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        // Kiểm tra nếu response đã có cấu trúc pagination (có total, page, limit, totalPages)
        if (data && typeof data === 'object' && 'total' in data && 'page' in data && 'limit' in data && 'totalPages' in data) {
          // Nếu đã có cấu trúc pagination, chỉ thêm timestamp và path
          return {
            ...data,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }

        // Nếu không có cấu trúc pagination, wrap trong data object
        return {
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
