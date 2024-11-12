import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserContact } from './entities/user-contact.entity';
import { UserBlocked } from './entities/user-blocked.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockContactsRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockBlockedRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository
        },
        {
          provide: getRepositoryToken(UserContact),
          useValue: mockContactsRepository
        },
        {
          provide: getRepositoryToken(UserBlocked),
          useValue: mockBlockedRepository
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Ajouter plus de tests ici
});