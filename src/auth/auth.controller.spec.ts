import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock de la réponse pour simuler les cookies
  const mockResponse = {
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  } as unknown as Response;

  // Mock des données renvoyées par AuthService
  const mockAuthResult = {
    user: {
      id: '123',
      username: 'testuser',
      email: 'test@example.com',
      avatar: null,
      role: 'user',
      tips: true
    },
    accessToken: 'access.token.here',
    refreshToken: 'refresh.token.here'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(mockAuthResult),
            logout: jest.fn().mockResolvedValue({ message: 'Logout successful' }),
            refreshToken: jest.fn().mockResolvedValue({
              accessToken: 'new.access.token',
              refreshToken: 'new.refresh.token'
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should successfully log in and set cookies', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const mockReq = {
        csrfToken: jest.fn().mockReturnValue('csrf-token'),
      };

      const result = await controller.login(mockReq as any, loginDto, mockResponse);

      // Vérifie que le service a été appelé
      expect(authService.login).toHaveBeenCalledWith(loginDto);

      // Vérifie que les cookies ont été configurés
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        mockAuthResult.accessToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict'
        })
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockAuthResult.refreshToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          path: '/api/auth/refresh-token'
        })
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'XSRF-TOKEN',
        'csrf-token',
        expect.objectContaining({
          httpOnly: false,
          sameSite: 'strict'
        })
      );

      // Vérifie la réponse
      expect(result).toEqual({
        message: 'Login successful',
        user: mockAuthResult.user
      });
    });
  });

  describe('logout', () => {
    it('should successfully log out and clear cookies', async () => {
      const mockReq = {
        cookies: {
          refreshToken: 'refresh.token.here'
        }
      };

      const result = await controller.logout(mockReq as any, mockResponse);

      // Vérifie que le service a été appelé
      expect(authService.logout).toHaveBeenCalledWith('refresh.token.here');

      // Vérifie que les cookies ont été nettoyés
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('token');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
        path: '/api/auth/refresh-token'
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('XSRF-TOKEN');

      expect(result).toEqual({ message: 'Logout successful' });
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh tokens and update cookies', async () => {
      const mockReq = {
        cookies: {
          refreshToken: 'old.refresh.token'
        },
        csrfToken: jest.fn().mockReturnValue('new-csrf-token'),
      };

      const result = await controller.refreshToken(mockReq as any, mockResponse);

      // Vérifie que le service a été appelé
      expect(authService.refreshToken).toHaveBeenCalledWith('old.refresh.token');

      // Vérifie que les nouveaux cookies ont été configurés
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        'new.access.token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict'
        })
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'new.refresh.token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          path: '/api/auth/refresh-token'
        })
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'XSRF-TOKEN',
        'new-csrf-token',
        expect.objectContaining({
          httpOnly: false,
          sameSite: 'strict'
        })
      );

      expect(result).toEqual({ message: 'Token refreshed successfully' });
    });
  });
});