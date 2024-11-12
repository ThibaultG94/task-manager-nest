import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserContact } from './entities/user-contact.entity';
import { UserBlocked } from './entities/user-blocked.entity';
import { getMockRepository } from '../../test/mocks/repository.mocks';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Ajouter plus de tests ici
});