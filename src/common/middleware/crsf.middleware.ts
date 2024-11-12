import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csrf from 'csurf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private csrfProtection = csrf({
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    }
  });

  use(req: Request, res: Response, next: NextFunction) {
    // Liste des routes à exclure de la protection CSRF
    const excludedRoutes = [
      { path: '/api/auth/login', method: 'POST' },
      { path: '/api/auth/register', method: 'POST' }
    ];

    // Vérifier si la route actuelle est exclue
    const isExcluded = excludedRoutes.some(
      route => req.path === route.path && req.method === route.method
    );

    if (isExcluded) {
      next();
    } else {
      this.csrfProtection(req, res, next);
    }
  }
}