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
- pnpm i @types/node @types/pg --save-dev        install des types node et pg pour TS
- pnpm i @prisma/adapter-pg (et @prisma client si manquant)     install les éléments de connection à ba DB
- on utilise pas dotenv dans notre projet mais config.ts

* oubli de mettre les valeurs de .env dans config.ts *

```bash
pnpm prisma init          #crée la base de prisma
```

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


### Création des tables dans la DB
lancement de la migration prisma `pnpm prisma migrate dev --name init`
  - erreur au lancement du script car nous sommes passés en prisma 7, il n'est plus possible d'utiliser datasource dans schemas.prisma
  - création d'un fichier prisma.config.ts
```ts
  import { PrismaClient } from "@prisma/client/extension";

  export const prisma = new PrismaClient({
    adapter: process.env.DATABASE_URL,
  })
```
  - lancement de la migration ok

### seeding dans la DB

- ajout script package.json `"db:seed" : "ts-node prisma/seed.ts"`
- ajout dép ts-node `pnpm add -D ts-node typescript` (permet de ne pas compiler le TS en JS avant chaque exécution)
  - PNPM a voulu changer le store (sans doute quand j'ai du donner à prisma des droits pour accéder au dossier local)
- ensuite prisma a beaucoup compliqué sa config depuis le 6 qu'on a vu en cours
  - il faut un fichier prisma.config.ts dans prisma, qui sera notre client
  - on peut (ou pas) lui préciser un adapter (déprécié) ou rien
  - ensuite il faut importer ce client dans le seed.ts
  - et comme on a modifié des choses il faut regénérer le client `pnpm prisma generate`

### on reprend prisma

dans /prisma/schema.prisma
Il faut préciser qu'on génère le fichier prisma

```js
generator client {
  provider = "prisma-client"                 
  output   = "./generated/prisma"            
}
```

Il faut lancer la commande `pnpm prisma generate`

Par défaut il va générer un dossier "generated" à l'endroit de l'output
Donc je trouve plus cohérent de le mettre dans le dossier prisma
Ce dossier contient notamment **le client prisma** qui contient:
- les classes PrismaClient
- les types typescript
- le code pour interragir avec la DB
(auparavant tout ça était dans les node_modules)


Le code TS qui veut accéder à la DB doit  **importer** notre client prisma 
Par exemple dans prisma.config.ts on va remplacer

```js
import { PrismaClient } from "@prisma/client/extension";
export const prisma = new PrismaClient();
```

par 

```js
import { PrismaClient } from "./generated/prisma/client.js";
export const prisma = new PrismaClient();
```

**prisma.config.ts** sert a générer une instance du client Prisma qu'on va pouvoir réutiliser, au lieu de créer une instance à chaque fois qu'on appelle le client
On pourra l'importer avec
```js
import { prisma } from "../prisma/index.ts";
```

Ensuite, pour exporter l'instance du client prisma, on ne peut plus faire
```js
export const prisma = new PrismaClient();
```
Il demande un argument. Cet argument c'est l'adapter.
On peut soit mettre dans l'adapter le contenu de DATABASE_URL avec process.env
Sauf qu'on nous a interdit d'utiliser process.env donc on doit utiliser un `SqlDriverAdapterFactory`

### On reprend dotenv

Donc, tous les avis disent que pour prisma 7 c'est mieux d'utiliser dotenv
Du coup je galère depuis des heures parce qu'on m'a dit hier pendant la mise en place de ne pas utiliser dotenv.
Donc je vais prendre une pause et ensuite j'installerai dotenv


### reprise au calme (soir)

Il y a de gros problèmes entre les types .ts, les fichiers .js les imports etc etc...
Bref entre express, ts, prisma v7 c'est le bazar, parce qu'au lieu de réfléchir on s'est précipités à mettre en place le dépot comme des sagouins.
Conclusion: 
- ne pas faire à deux, on ne prends pas le temps de se poser les questions et on fait n'importe quoi
- comprendre comprendre comprendre et ne pas accepter de se faire PL, mieux vaut rester bloquer tant que c'est pas compris

- installation des types d'express `pnpm install -D @types/express` > problème d'importation de express résolu
- prisma a le bon gout lors de sa génération de créer un fichier `/prisma.config.ts` qui a le même nom que `/prisma/prisma.config.ts` qui servait à intialiser le client > client renommé en `prisma.client.ts`
- le fichier `tsconfig.json` permet (ou bloque) les importations/exportations des fichiers en .ts (avec ou sans extension)
- quand je veux importer `import { PrismaClient } from "./generated/prisma/client.ts";` il me met un fichier en .js alors que ça n'existe pas (il y a un fichier en .ts à cet emplacement)

A priori la combinaison de Node ESM + TS natif + Prisma généré fait des plantages


pnpm prisma generate
pnpm prisma migrate dev
pnpm run db:seed


## Vendredi

### réparation de prisma

- suppression du dossier prisma (on a gardé le schemas par contre)
- mise à jour de prisma (on avait des versions 7.1, 7.0.1 et autres dans le package.json)
- mise à part du tsconfig.json (en disabled)
- initialisation de prisma :
  - `pnpx prisma init --datasource-provider postgresql`
- Modifier `prisma/schema.prisma` :
  - output     = "./generated/prisma"
  - ajouter les models
- `pnpx prisma generate`
> le schema.prisma a été regénéré correctement (on a juste rajouté les models)
> le prismaClient.ts a été regénéré par prisma dans generated avec les bonnes infos 

- créer notre prismaClient.ts
```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({connectionString : `${process.env.DATABASE_URL}`}),
});

export * from "./generated/prisma/client.ts";
```
- `pnpx prisma migrate reset`
- ` pnpx prisma migrate dev --name init`

- Fonction de test de prisma dans index.ts
```js
async function testPrisma(){
  // await prisma.$queryRaw`SELECT NOW()`
  const users = await prisma.user.findMany()
  console.log("Prisma ok", users)
}
```
- modification du script dans package.json `"db:seed": "node --env-file=.env ./src/models/seed.ts"`

### mise à jour de biome
-`pnpm remove biome`
- `pnpm i -D @biomejs/biome`
- `pnpm exec biome init`
- .vscode et settings.json -> nécéssaire pour faire marcher biome
- 