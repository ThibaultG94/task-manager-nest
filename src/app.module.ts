import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { UserContact } from './users/entities/user-contact.entity';
import { UserBlocked } from './users/entities/user-blocked.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, UserContact, UserBlocked],
      synchronize: process.env.DB_SYNC === 'true',
      connectTimeout: 60000,
      extra: {
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
      },
      // Gestion des reconnexions
      retryAttempts: 10,
      retryDelay: 3000,
      keepConnectionAlive: true
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
