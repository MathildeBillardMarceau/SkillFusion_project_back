// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "./generated/prisma/client.ts";

// export const prisma = new PrismaClient({
//   adapter: new PrismaPg({connectionString : `${process.env.DATABASE_URL}`}),
// });

// export * from "./generated/prisma/client.ts";

// prisma/prismaClient.ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
