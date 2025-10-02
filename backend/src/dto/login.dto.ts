import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: { value: string }) => value.toLowerCase())
    email: string;

    @IsNotEmpty()
    password: string;
}

export class LoginResponseDto {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        avatarUrl?: string | null;
    };
    accessToken: string;
    refreshToken: string;
    message: string;
}
