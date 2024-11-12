import { Controller, Post, Body, HttpCode, Res, UseGuards, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    async login(
        @Req() req: Request,
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const result = await this.authService.login(loginDto);

        // Configuration des cookies sécurisés
        response.cookie('token', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        response.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
            path: '/api/auth/refresh-token' // Restreint le cookie à la route de refresh
        });

        // Générer un nouveau token CSRF après login si la fonction existe
        if (req.csrfToken) {
            response.cookie('XSRF-TOKEN', req.csrfToken(), {
                httpOnly: false, // Doit être accessible par le frontend
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 heures
            });
        }

        return {
            message: 'Login successful',
            user: result.user
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(200)
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const refreshToken = req.cookies['refreshToken'];
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }

        // Nettoyer tous les cookies
        response.clearCookie('token');
        response.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
        response.clearCookie('XSRF-TOKEN');

        return { message: 'Logout successful' };
    }

    @Post('refresh-token')
    @HttpCode(200)
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const refreshToken = req.cookies['refreshToken'];
        const tokens = await this.authService.refreshToken(refreshToken);

        response.cookie('token', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth/refresh-token'
        });

        // Renouveler également le token CSRF lors du refresh
        if (req.csrfToken) {
            response.cookie('XSRF-TOKEN', req.csrfToken(), {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });
        }

        return { message: 'Token refreshed successfully' };
    }
}