## Installation
```bash
pnpm i
```

## Mise en place de la BDD de dev
Se connecter à Postgres
```bash
psql -U postgres
``` 
Créer un utilisateur
```bash
CREATE ROLE skillfusion WITH LOGIN CREATEDB PASSWORD 'skillfusion_pw';
\du # lister les utilisateurs
``` 
Créer la BDD
```bash
CREATE DATABASE skillfusion_db WITH OWNER skillfusion;
\l # lister les BDD
\q
```
Créer un `.env`
```ini
PORT=3000
PGUSER=skillfusion
PGPASSWORD=skillfusion_pw
PGDATABASE=skillfusion_db
PGHOST=127.0.0.1
PGPORT=5432

# DATABASE_URL="postgresql://skillfusion:skillfusion_pw@127.0.0.1:5432/skillfusion_db"
```
Créer les tables à partir des models prisma
```bash
pnpm db:init
```


## Lancement du projet
```bash
pnpm dev
```

Accès à [Apollo Server](http://localhost:4000/graphql)