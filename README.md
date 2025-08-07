# Antimemetics Division - Full Stack Application

A comprehensive full-stack application built with modern technologies including NestJS backend, Next.js frontend, and gRPC microservices.

## 🏗️ Architecture Overview

This project follows a microservices architecture with the following components:

- **Backend API** (NestJS) - Main REST API service
- **Frontend** (Next.js) - React-based web application
- **Messenger Service** (gRPC) - Microservice for messaging
- **Database** (PostgreSQL) - Primary data storage
- **pgAdmin** - Database management interface

## 🛠️ Tech Stack

### Backend (NestJS)

- **Framework**: NestJS v11.0.1
- **Language**: TypeScript v5.7.3
- **Database ORM**: TypeORM v0.3.25
- **Authentication**: JWT with Passport
- **Database**: PostgreSQL v15 (via Docker)
- **Validation**: class-validator v0.14.2
- **Testing**: Jest v30.0.0

### Frontend (Next.js)

- **Framework**: Next.js v15.4.5
- **Language**: TypeScript v5
- **UI Library**: React v19.1.0
- **Styling**: Tailwind CSS v4
- **Development**: Turbopack enabled

### Messenger Service (gRPC)

- **Framework**: NestJS v11.0.1
- **Protocol**: gRPC v1.9.0
- **Language**: TypeScript v5.7.3
- **Database**: TypeORM v0.3.25

### Database & Infrastructure

- **Database**: PostgreSQL v15-alpine
- **Containerization**: Docker & Docker Compose
- **Database Management**: pgAdmin v4
- **Environment**: Node.js (LTS recommended)

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd antimemetics-division
```

### 2. Start the Database

```bash
cd database
docker-compose up -d
```

This will start:

- PostgreSQL database on port `5432`
- pgAdmin interface on port `5050`

**Database Credentials:**

- Database: `nextjs_nestjs_db`
- Username: `postgres`
- Password: `postgres123`
- pgAdmin: `admin@admin.com` / `admin123`

### 3. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

# Messenger service dependencies
cd ../messenger-service
npm install
```

### 4. Environment Configuration

#### Backend Environment

Create `.env` file in the `backend` directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_DATABASE=nextjs_nestjs_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Server
PORT=3000
```

#### Frontend Environment

Create `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Messenger Service Environment

Create `.env` file in the `messenger-service` directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_DATABASE=nextjs_nestjs_db

# gRPC
MESSENGER_PORT=5002
```

### 5. Run Database Migrations

```bash
cd backend
npm run migration:run
```

### 6. Start the Services

#### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

**Terminal 3 - Messenger Service:**

```bash
cd messenger-service
npm run start:dev
```

#### Production Mode

```bash
# Build all services
cd backend && npm run build
cd ../frontend && npm run build
cd ../messenger-service && npm run build

# Start production servers
cd backend && npm run start:prod
cd ../frontend && npm run start
cd ../messenger-service && npm run start:prod
```

## 🌐 Service URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Messenger Service**: http://localhost:5002
- **pgAdmin**: http://localhost:5050

## 📁 Project Structure

```
antimemetics-division/
├── backend/                 # NestJS REST API
│   ├── src/
│   │   ├── controllers/     # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── config/          # Database & app config
│   │   ├── guards/          # Authentication guards
│   │   ├── dto/            # Data transfer objects
│   │   └── migrations/     # Database migrations
│   └── package.json
├── frontend/               # Next.js React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── services/       # API services
│   │   └── contexts/       # React contexts
│   └── package.json
├── messenger-service/       # gRPC microservice
│   ├── src/
│   │   ├── services/       # gRPC services
│   │   └── proto/          # Protocol buffers
│   └── package.json
└── database/              # Docker database setup
    ├── docker-compose.yml
    └── init-scripts/      # Database initialization
```

## 🔧 Development Commands

### Backend Commands

```bash
cd backend

# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run migrations

# Testing
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Test coverage

# Code Quality
npm run lint              # ESLint
npm run format            # Prettier formatting
```

### Frontend Commands

```bash
cd frontend

# Development
npm run dev               # Start development server
npm run build             # Build for production
npm run start             # Start production server

# Code Quality
npm run lint              # ESLint
```

### Messenger Service Commands

```bash
cd messenger-service

# Development
npm run start:dev         # Start with hot reload
npm run start:port        # Start on custom port

# Testing
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm run test              # Unit tests
npm run test:e2e          # Integration tests
npm run test:cov          # Coverage report
```

### Frontend Testing

```bash
cd frontend
npm run test-api          # Test API connectivity
```

## 📊 Database Management

### Access pgAdmin

1. Open http://localhost:5050
2. Login with: `admin@admin.com` / `admin123`
3. Add server connection:
   - Host: `postgres` (or `localhost` if accessing from host)
   - Port: `5432`
   - Database: `nextjs_nestjs_db`
   - Username: `postgres`
   - Password: `postgres123`

### Database Migrations

```bash
cd backend
npm run migration:generate -- src/migrations/MigrationName
npm run migration:run
```

## 🔐 Authentication

The application uses JWT-based authentication with refresh tokens:

- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- **Storage**: HTTP-only cookies for security

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Ensure Docker is running
   - Check if PostgreSQL container is up: `docker ps`
   - Verify database credentials in `.env` files

2. **Port Already in Use**

   - Check if services are already running
   - Kill processes using the ports: `lsof -ti:3000 | xargs kill -9`

3. **Migration Errors**

   - Ensure database is running
   - Check database connection settings
   - Run: `npm run migration:run`

4. **Frontend API Connection Issues**
   - Verify backend is running on port 3000
   - Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Debug Mode

```bash
# Backend debug
cd backend
npm run start:debug

# Frontend debug
cd frontend
npm run dev
# Then open browser dev tools
```

## 📝 API Documentation

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Todo Endpoints

- `GET /todos` - Get all todos (with filtering)
- `POST /todos` - Create new todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the troubleshooting section above
- Review the individual service README files
- Open an issue on the repository

---

**Note**: This is a development setup. For production deployment, ensure proper security configurations, environment variables, and infrastructure setup.
