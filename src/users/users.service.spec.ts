import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserContact } from './entities/user-contact.entity';
import { UserBlocked } from './entities/user-blocked.entity';
import { getMockRepository } from '../../test/mocks/repository.mocks';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: getMockRepository()
        },
        {
          provide: getRepositoryToken(UserContact),
          useValue: getMockRepository()
        },
        {
          provide: getRepositoryToken(UserBlocked),
          useValue: getMockRepository()
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