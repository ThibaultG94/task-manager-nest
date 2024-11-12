import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '@/users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getMockRepository } from '../../test/mocks/repository.mocks';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let refreshTokenRepository: Repository<RefreshToken>;
  let jwtService: JwtService;

  // Mock complet de User avec toutes les propriétés requises
  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: '$2b$10$Rw5P.D/bqsp4HTk7TYwZWeYk0rN4n9khcx',
    username: 'testuser',
    role: 'user',
    avatar: null,
    tips: true,
    contacts: [],
    blocked: [],
    refreshTokens: Promise.resolve([]),
    createdAt: new Date(),
    updatedAt: new Date()
  } as User;

  // Mock complet de RefreshToken
  const mockRefreshToken: RefreshToken = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    token: 'refresh.token.here',
    userId: mockUser.id,
    user: mockUser,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  } as RefreshToken;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            ...getMockRepository(),
            findOne: jest.fn().mockResolvedValue(mockUser),
          }
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            ...getMockRepository(),
            findOne: jest.fn().mockResolvedValue(mockRefreshToken),
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('jwt.token.here'),
            verify: jest.fn().mockReturnValue({ sub: mockUser.id }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshTokenRepository = module.get<Repository<RefreshToken>>(getRepositoryToken(RefreshToken));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      const result = await service.validateUser('test@example.com', 'Password123!');
      expect(result).toEqual(mockUser);
    });

    it('should return null when email is incorrect', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      const result = await service.validateUser('wrong@example.com', 'Password123!');
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
      const result = await service.validateUser('test@example.com', 'WrongPassword123!');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return tokens and user data when login is successful', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('access.token.here')
        .mockResolvedValueOnce('refresh.token.here');

      const result = await service.login({
        email: 'test@example.com',
        password: 'Password123!'
      });

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          avatar: mockUser.avatar,
          role: mockUser.role,
          tips: mockUser.tips
        },
        accessToken: 'access.token.here',
        refreshToken: 'refresh.token.here'
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(
        service.login({
          email: 'wrong@example.com',
          password: 'WrongPassword123!'
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const mockValidRefreshToken = {
        ...mockRefreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 heure dans le futur
      };

      jest.spyOn(refreshTokenRepository, 'findOne').mockResolvedValue(mockValidRefreshToken);
      jest.spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('new.access.token')
        .mockResolvedValueOnce('new.refresh.token');

      const result = await service.refreshToken('valid.refresh.token');

      expect(result).toEqual({
        accessToken: 'new.access.token',
        refreshToken: 'new.refresh.token'
      });
    });

    // ... autres tests
  });
});