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
├── test/                     # Dossier racine pour tous les tests
│   ├── e2e/                  # Tests end-to-end
│   │   └── app.e2e-spec.ts
│   ├── mocks/                # Mocks réutilisables
│   │   └── repository.mocks.ts
│   ├── utils/                # Utilitaires de test
│   │   └── test-utils.ts
│   ├── jest-setup.ts
│   └── jest-e2e.json
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
