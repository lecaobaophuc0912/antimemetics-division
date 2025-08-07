# Frontend Setup Guide

## Environment Configuration

### 1. Environment Variables
Copy `env.local` to `.env.local`:
```bash
cp env.local .env.local
```

### 2. Environment Variables Explained
- `NEXT_PUBLIC_API_URL`: Backend server URL (default: http://localhost:3001)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (default: http://localhost:3001/api)
- `PORT`: Frontend server port (default: 3000)
- `NEXT_PUBLIC_FRONTEND_PORT`: Frontend port for client-side (default: 3000)
- `NEXT_PUBLIC_DEBUG`: Enable debug mode

### 3. Change Port
To change the port, simply edit the `.env.local` file:
```bash
# Change port to 3002
PORT=3002
NEXT_PUBLIC_FRONTEND_PORT=3002
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test API Connection
```bash
npm run test-api
```

## Backend Connection

### API Proxy Configuration
The frontend is configured to proxy API calls to the backend:
- All `/api/*` requests are automatically forwarded to `http://localhost:3001/api/*`
- This eliminates CORS issues during development

### API Service
- Located at `src/services/api.ts`
- Handles authentication, user management, and API calls
- Automatically includes auth tokens in requests

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test-api` - Test backend connection

## Backend Requirements

Make sure your backend server is running on port 3001 with these endpoints:
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile (protected)

## Troubleshooting

### CORS Issues
If you encounter CORS issues:
1. Make sure backend is running on port 3001
2. Check that Next.js proxy is working (see next.config.ts)
3. Verify environment variables are set correctly

### API Connection Issues
1. Run `npm run test-api` to diagnose connection problems
2. Check if backend server is running: `curl http://localhost:3001/api/health`
3. Verify network connectivity between frontend and backend 