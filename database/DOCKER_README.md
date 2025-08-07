# PostgreSQL Docker Setup

Guide for setting up and using PostgreSQL with Docker for the NextJS-NestJS project.

## Configuration

The `docker-compose.yml` file is configured with:
- PostgreSQL 15 (Alpine version)
- pgAdmin 4 (database management)
- Persistent volume for data
- Private network for services

## Connection Information

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: antimemetics_messenger
- **Username**: postgres
- **Password**: postgres123

### pgAdmin
- **URL**: http://localhost:5050
- **Email**: admin@admin.com
- **Password**: admin123

## Basic Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# View PostgreSQL logs
docker-compose logs postgres

# View pgAdmin logs
docker-compose logs pgadmin

# View all logs
docker-compose logs
```

### Connect directly to PostgreSQL
```bash
docker exec -it nextjs-nestjs-postgres psql -U postgres -d antimemetics_messenger
```

### Backup database
```bash
docker exec -it nextjs-nestjs-postgres pg_dump -U postgres antimemetics_messenger > backup.sql
```

### Restore database
```bash
docker exec -i nextjs-nestjs-postgres psql -U postgres -d antimemetics_messenger < backup.sql
```

## Connect from NestJS

Add dependencies to `backend/package.json`:
```json
{
  "dependencies": {
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.3"
  }
}
```

Configure in `backend/src/app.module.ts`:
```typescript
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres123',
      database: process.env.POSTGRES_DB || 'antimemetics_messenger',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only use in development
    }),
  ],
})
export class AppModule {}
```

## Security Notes

1. **Change passwords**: Change default passwords in production
2. **Environment variables**: Use `.env` file to store sensitive information
3. **Network security**: Only expose necessary ports
4. **Backup**: Regularly backup data

## Troubleshooting

### Port already in use
If port 5432 or 5050 is already in use, change in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Change host port
```

### Container won't start
Check logs:
```bash
docker-compose logs postgres
```

### Database connection failed
1. Check if container is running: `docker-compose ps`
2. Check network: `docker network ls`
3. Restart services: `docker-compose restart` 