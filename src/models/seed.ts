//import { prisma } from "../../prisma/prisma.config.ts"
// j'importe mon client prisma
import { prisma } from "../../prisma/prismaClient.ts";



await prisma.user.createMany({ data: [
  {
    email: "alice@mail.com",
    password: "alice123",
    firstname: "alice",
    lastname: "fusion",
    role:"ADMIN",
    status: "APPROVED",
  }, 
  {
    email: "bob@mail.com",
    password: "bob123",
    firstname: "Bob",
    lastname: "fusion"
  }
]})

console.log("Données d'échantillonnage correctement ajoutées dans la BDD")