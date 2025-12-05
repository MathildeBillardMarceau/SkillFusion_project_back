import { config } from "./config.ts";
import express from 'express';
import type { Request, Response } from 'express';
import { prisma } from "../prisma/prismaClient.ts";

export const app = express();

console.log("config:", config);

const PORT = config.port;

app.get("/", (req: Request, res: Response) => res.send ("Hello Skillfusion back"));

app.listen(PORT, () => {
  console.log(`🚀 Server ready: http://localhost:${PORT}`);
});

async function testPrisma(){
  // await prisma.$queryRaw`SELECT NOW()`
  const users = await prisma.user.findMany()
  console.log("Prisma ok", users)
}
testPrisma()