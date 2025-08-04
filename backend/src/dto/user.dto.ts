import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsNumber,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class RegisterResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
  message: string;
}

export interface UserRequest {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}