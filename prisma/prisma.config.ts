import { PrismaClient } from "@prisma/client/extension";

export const prisma = new PrismaClient({
  adapter: process.env.DATABASE_URL,
})