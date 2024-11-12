# Task Manager NestJS Project Structure

```
task-manager-nest/
├── dist/                       # Dossier de build
├── node_modules/              # Dépendances
├── src/
│   ├── auth/                  # Module d'authentification
│   │   ├── dto/
│   │   │   ├── auth-response.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── entities/
│   │   │   └── refresh-token.entity.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   └── auth.service.ts
│   │
│   ├── common/               # Éléments partagés
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── all-exceptions.filter.ts
│   │   ├── guards/
│   │   │   └── roles.guard.ts
│   │   ├── middleware/
│   │   │   ├── csrf.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   └── rate-limiter.middleware.ts
│   │   └── pipes/
│   │       └── sanitize.pipe.ts
│   ├── test
│   │   └── mocks
│   │       └── repository.mocks.ts
│   │
│   ├── types/               # Types globaux
│   │   └── express.d.ts
│   │
│   ├── users/              # Module utilisateurs
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   ├── user-blocked.entity.ts
│   │   │   ├── user-contact.entity.ts
│   │   │   └── user.entity.ts
│   │   ├── users.controller.spec.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.spec.ts
│   │   └── users.service.ts
│   │
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
│
├── test/                    # Tests e2e
│   ├── jest-setup.ts        # Configuration globale des tests
│   ├── jest-e2e.json        # Configuration pour les tests e2e
│   └── app.e2e-spec.ts
│
├── .env                     # Variables d'environnement
├── .eslintrc.js            # Configuration ESLint
├── .gitignore
├── .prettierrc             # Configuration Prettier
├── Dockerfile              # Configuration Docker
├── README.md
├── nest-cli.json           # Configuration NestJS CLI
├── jest.config.js          # Configuration principale de Jest
├── package.json            # Dépendances et scripts
├── tsconfig.build.json     # Configuration TypeScript pour build
└── tsconfig.json           # Configuration TypeScript principale
```

## Description des répertoires principaux

### src/auth/

Gestion de l'authentification avec JWT et refresh tokens.

### src/common/

Composants réutilisables et middlewares de sécurité.

### src/users/

Gestion des utilisateurs et des relations entre utilisateurs.

### test/

Tests end-to-end de l'application.

## Fichiers de configuration importants

- **nest-cli.json**: Configuration du CLI NestJS
- **package.json**: Scripts NPM et dépendances
- **tsconfig.json**: Configuration TypeScript
- **Dockerfile**: Configuration pour le conteneur Docker
- **.env**: Variables d'environnement (non versionné)

## Points notables de sécurité

1. Protection CSRF
2. Rate Limiting
3. Guards de rôles
4. Sanitization des données
5. Logging sécurisé
6. Gestion des exceptions globale
