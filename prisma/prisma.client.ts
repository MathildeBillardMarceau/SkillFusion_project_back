//import { PrismaClient as PrismaGeneratedClient, Prisma } from "./generated/prisma/client.js";
//export const prisma: PrismaGeneratedClient = new PrismaGeneratedClient(undefined);

// import { PrismaClient } from "./generated/prisma/client.js";
//export const prisma = new PrismaClient();

// import { PrismaClient } from "./generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { config } from "../src/config";

// //import { sql } from "@prisma/client/extension"; (v6 déprécié)


// const url = `postgresql://${config.pguser}:${config.pgpassword}@${config.pghost}:${config.pgport}/${config.pgdatabase}?schema=public`;

// const adapter = new PrismaPg({connectionString:url});

// export const prisma = new PrismaClient({ adapter});


// export const prisma = new PrismaClient({
//   adapter: process.env.DATABASE_URL,
// })
// bon à priori l'adapter est un ancien fonctionnement pour prisma 6 donc ici pas besoin

// a cause de prisma 7, je suis obligé de créer un client dans ce fichier.
// je vais ensuite l'importer dans les autres fichiers qui en auront besoin