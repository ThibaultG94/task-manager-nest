import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private refreshTokensRepository: Repository<RefreshToken>,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({
            where: { email }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async login(loginDto: LoginDto): Promise<{ user: AuthResponseDto, accessToken: string, refreshToken: string }> {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        
        if (!user) {
            throw new UnauthorizedException('Email ou mot de passe incorrect');
        }

        const tokens = await this.generateTokens(user);
        await this.saveRefreshToken(tokens.refreshToken, user);

        const response: AuthResponseDto = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            tips: user.tips
        };

        return {
            user: response,
            ...tokens
        };
    }

    async logout(refreshToken: string): Promise<void> {
        await this.refreshTokensRepository.delete({ token: refreshToken });
    }

    async refreshToken(token: string): Promise<{ accessToken: string, refreshToken: string }> {
        const refreshToken = await this.refreshTokensRepository.findOne({
            where: { token },
            relations: ['user']
        });

        if (!refreshToken || refreshToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const tokens = await this.generateTokens(refreshToken.user);
        
        // Supprimer l'ancien refresh token et en créer un nouveau
        await this.refreshTokensRepository.remove(refreshToken);
        await this.saveRefreshToken(tokens.refreshToken, refreshToken.user);

        return tokens;
    }

    private async generateTokens(user: User) {
        const payload = { 
            sub: user.id, 
            email: user.email,
            role: user.role
        };
        
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { expiresIn: '15m' }), // Token de courte durée
            this.jwtService.signAsync(payload, { expiresIn: '7d' })  // Refresh token de 7 jours
        ]);

        return {
            accessToken,
            refreshToken
        };
    }

    private async saveRefreshToken(token: string, user: User): Promise<void> {
        const refreshToken = this.refreshTokensRepository.create({
            token,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
        });

        await this.refreshTokensRepository.save(refreshToken);
    }
}