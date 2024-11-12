import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserContact } from './entities/user-contact.entity';
import { UserBlocked } from './entities/user-blocked.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  const mockContactsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn()
  };

  const mockBlockedRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Ajouter plus de tests ici
});