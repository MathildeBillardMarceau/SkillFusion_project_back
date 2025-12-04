# Journal de bord

## Mise en place de prisma

### Git
- git branch -a           voir toutes les branches locales
- git fetch --all         récupérer les branches distantes manquantes
- git checkout develop    pour aller sur une branche (ici develop)
- git checkout -b feature/prisma-setup        pour créer une nouvelle branche (ici feature/prisma-setup)
- git push -u origin feature/prisma-setup     pour pousser la nouvelle branche une première fois

### Postgres

**Il faut avant tout une DB vide**

- sudo -i -u postgres psql
- CREATE USER skillfusion WITH LOGIN PASSWORD 'skillfusion';
- CREATE DATABASE skillfusion WITH OWNER skillfusion;
- ALTER USER skillfusion CREATEDB;

- vérifier en se connectant: psql -U skillfusion -h localhost

** ensuite mettre les infos dans le .env et le .env.example **
- ajouter les infos dans le .env
- dans le config.ts penser à rajouter chaque variable
- vérification dans le boot via un console log

### Prisma initialisation

- pnpm add -D prisma        ajouter prisma en dev
- pnpm add @prisma/client   (ici pas nécéssaire on avait déjà installé le client)
- pnpm install prisma @types/node @types/pg --save-dev        install des types node et pg pour TS
- pnpm install @prisma/adapter-pg (et @prisma client si manquant)     install les éléments de connection à ba DB
- on utilise pas dotenv dans notre projet mais config.ts

* oubli de mettre les valeurs de .env dans config.ts *

- pnpm prisma init          crée la base de prisma
`Error: EACCES: permission denied, mkdir '/home/student/.local/share/prisma-dev-nodejs'`
  -> se donner la propriété du fichier

- pnpm prisma init
`Failed to load config file "/var/www/html/SkillFusion/projet-skillfusion-back" as a TypeScript/JavaScript module. Error: PrismaConfigEnvError: Missing required environment variable: DATABASE_URL`

Rajouter dans le .env les données de DB lisibles par Prisma:

`DATABASE_URL=postgres://skillfusion:skillfusion@localhost:5432/skillfusion`


Suite à ceci on aura un dossier prisma et dedans un schemas.prisma

### schema.prisma

Configuration globale de l'ORM
```
generator client {
  provider = "prisma-client"                  // fait auto
  output   = "../src/generated/prisma"        // fait auto
}

datasource db {
  provider = "postgresql"                     // fait auto
  url = env("DATABASE_URL")             // lecture de la variable d'environnement
}
```

Voir le schemas.prisma pour les explications sur le code

1- mise en place des modèles Course et User
2- ajout de la relation User one-to-many Course
3- lancement de la migration prisma `pnpm prisma migrate dev --name init`
  - erreur au lancement du script car nous sommes passés en prisma 7, il n'est plus possible d'utiliser datasource dans schemas.prisma
  - création d'un fichier prisma.config.ts
```ts
  import { PrismaClient } from "@prisma/client/extension";

  export const prisma = new PrismaClient({
    adapter: process.env.DATABASE_URL,
  })
```
  - lancement de la migration ok