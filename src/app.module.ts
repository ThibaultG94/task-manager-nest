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
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, UserContact, UserBlocked],
      synchronize: process.env.DB_SYNC === 'true',
      extra: {
        connectionLimit: 5,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
        waitForConnections: true,
      },
      // Gestion des reconnexions
      keepConnectionAlive: true,
      retryAttempts: 3,
      retryDelay: 3000,
      poolSize: 5
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
