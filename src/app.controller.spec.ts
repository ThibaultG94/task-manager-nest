import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            count: jest.fn().mockResolvedValue(0)
          }
        }
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return API status', () => {
      const result = controller.getHello();
      expect(result).toEqual({ message: "API is running!" });
    });
  });

  describe('testDb', () => {
    it('should return success when database is connected', async () => {
      const result = await controller.testDb();
      expect(result).toEqual({
        status: 'success',
        message: 'Database connection successful',
        userCount: 0
      });
    });
  });
});