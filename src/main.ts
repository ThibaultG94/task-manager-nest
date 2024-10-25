// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Active la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans les DTOs
    forbidNonWhitelisted: true, // Rejette les requêtes contenant des propriétés non définies
    transform: true, // Transforme automatiquement les données selon les types
  }));

  // Active CORS si nécessaire pour ton frontend
  app.enableCors();

  // Préfixe global pour ton API (optionnel)
  app.setGlobalPrefix('api');

  await app.listen(process.env.DB_PORT ?? 3306);
}
bootstrap();