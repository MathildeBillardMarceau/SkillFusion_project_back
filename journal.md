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

- pnpm prisma initi          crée la base de prisma