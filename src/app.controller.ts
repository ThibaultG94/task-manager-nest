import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';

@Controller() // Enlève le 'api' ici
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get()
  getHello() {
    return { message: "API is running!" };
  }

  @Get('test-db')
  async testDb() {
    try {
      const count = await this.userRepository.count();
      return {
        status: 'success',
        message: 'Database connection successful',
        userCount: count
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: error.message
      };
    }
  }
}