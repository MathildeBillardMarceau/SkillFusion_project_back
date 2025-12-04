import { PrismaClient } from "./generated/prisma/client.js";
import { config } from "../src/config.js";
import { sql } from "@prisma/client/extension";


const adapter = sql({
  url: `postgresql://${config.pguser}:${config.pgpassword}@${config.pghost}:${config.pgport}/${config.pgdatabase}?schema=public`;
})


export const prisma = new PrismaClient({ adapter});


// export const prisma = new PrismaClient({
//   adapter: process.env.DATABASE_URL,
// })
// bon à priori l'adapter est un ancien fonctionnement pour prisma 6 donc ici pas besoin

// a cause de prisma 7, je suis obligé de créer un client dans ce fichier.
// je vais ensuite l'importer dans les autres fichiers qui en auront besoin