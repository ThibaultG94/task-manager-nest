import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { UserContact } from './users/entities/user-contact.entity';
import { UserBlocked } from './users/entities/user-blocked.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'mariadb',
      entities: [User, UserContact, UserBlocked],
      synchronize: process.env.DB_SYNC ? true : false,
      autoLoadEntities: true,
      extra: {
        connectionLimit: 5,
        waitForConnections: true,
      },
      logging: process.env.NODE_ENV === 'development', // Logs uniquement en dev
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}