import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  console.log('🚀 Application starting...');

  try {
    const app = await NestFactory.create(AppModule);

    // Ajout de Helmet AVANT les autres middlewares
    app.use(helmet({
      // Configuration des CSP (Content Security Policy)
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],  // Autorise uniquement les ressources de la même origine
          scriptSrc: ["'self'"],   // Autorise uniquement les scripts de la même origine
          styleSrc: ["'self'", "'unsafe-inline'"],  // Pour le CSS
          imgSrc: ["'self'", "data:", "https:"],    // Pour les images
        },
      },
      // Autres options de sécurité
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: "same-site" },
      dnsPrefetchControl: true,
      frameguard: { action: "deny" },  // Empêche le clickjacking
      hidePoweredBy: true,             // Cache le header X-Powered-By
      hsts: { maxAge: 31536000 },      // Force HTTPS
      noSniff: true,                   // Empêche le MIME-type sniffing
      referrerPolicy: { policy: "no-referrer" },
    }));
    
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

    app.use(cookieParser());
    
    await app.listen(process.env.PORT || 3306);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();