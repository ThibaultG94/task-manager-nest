import { IsString, IsEmail, MinLength, IsOptional, IsBoolean, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9_-]*$/, {
        message: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, underscores et tirets'
      })
    username: string;

    @IsEmail()
    @MaxLength(200)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(80)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: 'Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial'
    })
    password: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsBoolean()
    tips?: boolean;
}
