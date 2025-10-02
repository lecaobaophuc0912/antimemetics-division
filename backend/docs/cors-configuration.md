# CORS Configuration Guide

## Overview
This file provides guidance on configuring CORS (Cross-Origin Resource Sharing) in NestJS to support multiple domains.

## CORS Configuration

### 0. Supported Pattern Types

#### String Pattern (Exact Match)
```bash
# Specific domain
ALLOWED_ORIGINS=https://example.com,http://localhost:3000
```

#### Wildcard Pattern
```bash
# All subdomains
ALLOWED_ORIGINS=https://*.example.com

# All localhost ports
ALLOWED_ORIGINS=http://localhost:*

# All local IP ports
ALLOWED_ORIGINS=http://127.0.0.1:*
```

#### Regex Pattern
```bash
# Pattern starting and ending with /
ALLOWED_ORIGINS=/\.ngrok-free\.app$/,/^https:\/\/.*\.example\.com$/

# Domain with dynamic port
ALLOWED_ORIGINS=/^https:\/\/example\.com:\d+$/
```

#### Universal Pattern
```bash
# Allow all (only use in development)
ALLOWED_ORIGINS=*
```

### 1. Environment Variables
Add the following variables to your `.env` file:

```bash
# CORS Configuration
# List of allowed domains (comma-separated)
# Supports patterns: string, wildcard (*), regex (/pattern/)
ALLOWED_ORIGINS=https://yourdomain.com,https://*.yourdomain.com,/\.ngrok-free\.app$/,*

# Allow credentials (cookies, authorization headers)
CORS_CREDENTIALS=true

# Allowed HTTP methods (comma-separated)
CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS

# Allowed headers (comma-separated)
CORS_ALLOWED_HEADERS=Origin,X-Requested-With,Content-Type,Accept,Authorization,X-API-Key,Cache-Control,Pragma

# Exposed headers to client (comma-separated)
CORS_EXPOSED_HEADERS=X-Total-Count,X-Page-Count,X-Current-Page,X-Per-Page

# Cache preflight request (seconds)
CORS_MAX_AGE=3600
```

### 2. Default Configuration
If no environment variables are provided, the system will use default configuration:

```typescript
// Development domains
- http://localhost:3000
- http://localhost:3001
- http://localhost:3002

// Production domains (replace with actual domains)
- https://yourdomain.com
- https://www.yourdomain.com

// Ngrok domains (for development)
- *.ngrok-free.app
- *.ngrok.io

// Vercel preview domains
- *.vercel.app

// Netlify preview domains
- *.netlify.app
```

### 3. Adding New Domains

#### Method 1: Using Environment Variables
```bash
# String pattern - specific domain
ALLOWED_ORIGINS=https://newdomain.com,https://app.newdomain.com

# Wildcard pattern - all subdomains
ALLOWED_ORIGINS=https://*.newdomain.com

# Regex pattern - domain by pattern
ALLOWED_ORIGINS=/\.newdomain\.com$/

# Allow all (only use in development)
ALLOWED_ORIGINS=*
```

#### Method 2: Direct Code Modification
Update file `src/config/cors.environment.ts`:

```typescript
const defaultOrigins = [
    'https://newdomain.com',
    'https://*.newdomain.com',
    /\.ngrok-free\.app$/,
];
```

### 4. Production Configuration

#### Whitelist specific domains:
```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Allow all subdomains:
```bash
ALLOWED_ORIGINS=https://*.yourdomain.com
```

#### Using regex patterns:
```bash
# Allow all subdomains of yourdomain.com
ALLOWED_ORIGINS=/^https:\/\/.*\.yourdomain\.com$/

# Allow domain with specific port
ALLOWED_ORIGINS=/^https:\/\/yourdomain\.com:\d+$/
```

### 5. Development Configuration

#### Allow all localhost ports:
```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://127.0.0.1:3000
```

#### Allow all localhost:
```bash
ALLOWED_ORIGINS=http://localhost:*,http://127.0.0.1:*
```

#### Using wildcard patterns:
```bash
# Allow all localhost ports
ALLOWED_ORIGINS=http://localhost:*

# Allow all local IPs
ALLOWED_ORIGINS=http://127.0.0.1:*

# Allow all (only use in development)
ALLOWED_ORIGINS=*
```

### 6. Testing CORS

#### Test with curl:
```bash
curl -H "Origin: https://yourdomain.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/api/endpoint
```

#### Test with browser console:
```javascript
fetch('http://localhost:3000/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ data: 'test' }),
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### 7. Troubleshooting

#### CORS errors in browser:
- Check if `ALLOWED_ORIGINS` contains the frontend domain
- Ensure `CORS_CREDENTIALS=true` if using cookies
- Check protocol (http vs https)

#### Preflight request errors:
- Ensure `OPTIONS` method is allowed
- Check if `CORS_ALLOWED_HEADERS` contains necessary headers

#### Credentials errors:
- Ensure `CORS_CREDENTIALS=true`
- Frontend must set `credentials: 'include'` in fetch/axios

### 8. Security Considerations

- **DO NOT** use `origin: "*"` in production
- Whitelist only necessary domains
- Use HTTPS in production
- Regularly check and update domain list

### 9. Performance

- `CORS_MAX_AGE` helps cache preflight requests
- Default value: 3600 seconds (1 hour)
- Can increase to 86400 seconds (24 hours) if needed

## Related Files

- `src/main.ts` - Main CORS configuration
- `src/config/cors.environment.ts` - Configuration from environment variables
- `src/config/cors.config.ts` - Default configuration
