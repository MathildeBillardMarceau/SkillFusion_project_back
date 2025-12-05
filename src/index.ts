import type { Request, Response } from "express";
import express from "express";
import { prisma } from "../prisma/prismaClient.ts";
import { config } from "./config.ts";

async function init() {
	const app = express();

	app.get("/", (req: Request, res: Response) =>
		res.send("Hello Skillfusion back"),
	);

	console.log("config:", config);
	const { PORT } = config;

	app.listen(PORT, () => {
		console.log(`🚀 Server ready: http://localhost:${PORT}`);
	});
}

await init();

async function testPrisma() {
	// await prisma.$queryRaw`SELECT NOW()`
	const users = await prisma.user.findMany();
	console.log("Prisma ok", users);
}
testPrisma();
