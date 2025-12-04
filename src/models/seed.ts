//import { prisma } from "../../prisma/prisma.config.ts"
// j'importe mon client prisma
import { prisma } from "../../prisma/prisma.config.js";

// je fais une fonction pour ajouter 2 users
async function seedUsers(){
  try {
      const user1 = await prisma.user.create({
      data: {
      email: "alice@mail.com",
      password: "alice123",
      firstname: "alice",
      lastname: "fusion",
      role:"ADMIN",
      status: "APPROVED",
    },
  });

  const user2 = await prisma.user.create({
      data: {
      email: "bob@mail.com",
      password: "bob123",
      firstname: "Bob",
      lastname: "fusion"
    },
  });

  console.log("user 1:", user1);
  console.log("user 1:", user2);


  } catch (error) {
    console.error("Erreur lors du seed:", error);
  } finally {
    await prisma.$disconnect(); // méthode spéciale de prisma pour se déconnecter de la DB après requête d'ou le $
  }
}


await seedUsers();