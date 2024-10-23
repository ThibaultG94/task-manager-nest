import { IsString, IsEmail, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsBoolean()
    tips?: boolean;
}
