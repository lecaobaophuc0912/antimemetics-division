# Authentication Service with TypeORM

## Overview

AuthService has been improved to efficiently use TypeORM with security features:

- **Bcrypt**: Secure password hashing and comparison
- **JWT**: Create and verify access tokens
- **TypeORM**: Use Repository pattern to interact with database
- **Validation**: Use class-validator to validate input

## Main Methods

### 1. Login
```typescript
async login(loginDto: LoginDto): Promise<LoginResponseDto>
```

**Functionality:**
- Find user by email using TypeORM `findOne()`
- Compare password using bcrypt `compare()`
- Create JWT token with payload containing user info
- Return user info (excluding password) and access token

**Usage example:**
```typescript
const result = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});
// Result: { user: {...}, accessToken: 'jwt_token', message: 'Login successful' }
```

### 2. Register
```typescript
async register(registerDto: RegisterDto): Promise<RegisterResponseDto>
```

**Functionality:**
- Check if email already exists
- Hash password using bcrypt with salt rounds = 10
- Create new user using TypeORM `create()` and `save()`
- Return created user info

**Usage example:**
```typescript
const result = await authService.register({
  email: 'newuser@example.com',
  password: 'password123',
  name: 'New User',
  role: 'user'
});
```

### 3. Verify Token
```typescript
async verifyToken(token: string)
```

**Functionality:**
- Verify JWT token and return payload
- Throw UnauthorizedException if token is invalid

### 4. Get User Profile
```typescript
async getUserProfile(userId: string)
```

**Functionality:**
- Get user information by ID (excluding password)
- Use TypeORM `select()` to only get necessary fields

## TypeORM Configuration

### Entity Configuration
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
  
  // ... other fields
}
```

### Repository Injection
```typescript
constructor(
  @InjectRepository(User)
  private userRepository: Repository<User>,
  private jwtService: JwtService,
) {}
```

## Error Handling

Service uses NestJS exceptions:
- `NotFoundException`: When user doesn't exist
- `UnauthorizedException`: When credentials are invalid or token is invalid

## Security Features

1. **Password Hashing**: Use bcrypt with salt rounds = 10
2. **JWT Tokens**: Access token with expiration time
3. **Input Validation**: Use class-validator decorators
4. **Selective Field Loading**: Only load necessary fields from database
5. **Password Exclusion**: Never return password in response

## Environment Variables

```env
JWT_SECRET=your-secret-key-here
```

## Dependencies

- `@nestjs/typeorm`: TypeORM integration
- `@nestjs/jwt`: JWT functionality
- `bcryptjs`: Password hashing
- `class-validator`: Input validation
- `class-transformer`: Data transformation 