// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🚀 Application starting...');
  console.log('📊 Database config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  });

  try {
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
    
    const port = process.env.PORT || 3306;
    await app.listen(port);
    console.log(`✅ Application is running on port ${port}`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();