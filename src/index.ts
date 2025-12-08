import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
// import { expressMiddleware } from "@apollo/server/express5";
import { prisma } from "../prisma/prismaClient.ts";
import { config } from "./config.ts";
import { resolvers } from "./graphql/resolvers/index.ts";
import { typeDefs } from "./graphql/typeDefs/index.ts";

async function init() {
	const app = express();

	// Apollo Server
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});

	await server.start();

	app.use(
		"/graphql",
		cors({
			origin: "http://localhost:3000", // pour le front
			// credentials: true, // cookies/JWT
		}),
		express.json(),
		expressMiddleware(server, {
			context: async ({ req }) => ({ prisma }),
		}),
	);

	app.get("/", (req: Request, res: Response) =>
		res.send("Hello Skillfusion back"),
	);

	console.log("config:", config);
	const { PORT } = config;

	app.listen(PORT, () => {
		console.log(`🚀 Server ready: http://localhost:${PORT}/graphql`);
	});
}

await init();

// async function testPrisma() {
// 	// await prisma.$queryRaw`SELECT NOW()`
// 	const users = await prisma.user.findMany();
// 	console.log("Prisma ok", users);
// }
// testPrisma();
