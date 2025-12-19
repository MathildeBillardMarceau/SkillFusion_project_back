## Prérequis 
node 22.20

## Installation
```bash
pnpm i
```

## Lancement du projet :
1. soit manuellement
2. soit avec Docker

### Option 1 : Manuellement
#### Mise en place de la BDD de dev
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
PORT=4000
PGUSER=skillfusion
PGPASSWORD=skillfusion_pw
PGDATABASE=skillfusion_db
PGHOST=127.0.0.1
PGPORT=5432

DATABASE_URL=postgresql://skillfusion:skillfusion_pw@127.0.0.1:5432/skillfusion_db
```
Créer les tables à partir des models prisma
```bash
pnpm db:init
```

#### Lancement du projet en dev
```bash
pnpm dev
```

Accès à [Apollo Server](http://localhost:4000/graphql)

### Option 2 : Utilisation de docker

#### En mode dev

Créer un `.env`
```ini
PORT=4000
PGUSER=skillfusion
PGPASSWORD=skillfusion_pw
PGDATABASE=skillfusion_db_dev # Ici on pointe vers une bdd de dev skillfusion_db_dev
PGHOST=127.0.0.1
PGPORT=5433 # 5433 !! pour Docker

DATABASE_URL=postgresql://skillfusion:skillfusion_pw@127.0.0.1:5433/skillfusion_db_dev # 5433 !! pour Docker # Ici on pointe vers une bdd de dev skillfusion_db_dev

CMD=sh -c "pnpm run db:generate && pnpm run db:reset && pnpm dev"
# ou si on ne veut pas reset/seed, mais juse lancer : 
# CMD=sh -c "pnpm dev"
```

Lancer la commande 
```bash
docker compose up --build
```

#### En mode prod

Créer un `.env`
```ini
PORT=4000
PGUSER=skillfusion
PGPASSWORD=skillfusion_pw
PGDATABASE=skillfusion_db
PGHOST=127.0.0.1
PGPORT=5433 # 5433 !! pour Docker

DATABASE_URL=postgresql://skillfusion:skillfusion_pw@127.0.0.1:5433/skillfusion_db # 5433 !! pour Docker

CMD=pnpm run docker:start
```

Lancer la commande 
```bash
docker compose up --build
```

> Pour vider la bdd
> ```bash
> pnpm db:migrate:reset
> ```

## Lancement du projet par Docker avec supabase :
1. créez et renseignez votre fichier .env.supabase
2. lancez la commande `pnpm docker:dev:supabase`

## Lancement du projet par Docker avec bdd locale :
lancez la commande `pnpm docker:dev:local`