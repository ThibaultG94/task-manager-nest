import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginDto {
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
}
