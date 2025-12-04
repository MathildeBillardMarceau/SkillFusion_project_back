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