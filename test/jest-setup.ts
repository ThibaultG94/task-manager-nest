import { useContainer } from 'class-validator';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  useContainer(app, { fallbackOnErrors: true });
  await app.init();
});

// Utilitaires globaux pour les tests
global.createTestingModule = async (metadata: any) => {
  const module = await Test.createTestingModule(metadata).compile();
  return module;
};

// Mock des services communs
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});