import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prismaClient.ts";
import { config } from "./config.ts";
import { resolvers } from "./graphql/resolvers/index.ts";
import { typeDefs } from "./graphql/typeDefs/index.ts";

export async function init() {
	console.log("config:", config);
	const { PORT, JWT_SECRET } = config;
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
			context: async ({ req }) => {
				const authHeader = req.headers.authorization || "";
				const accessToken = authHeader.replace("Bearer", "").trim();
				let connectedUser = null;
				if (accessToken) {
					try {
						connectedUser = jwt.verify(accessToken, JWT_SECRET);
						console.log("TOKEN", connectedUser);
					} catch (e) {
						console.log("invalid access token");
					}
				}

				return { prisma, connectedUser };
			},
		}),
	);

	app.get("/", (_req: Request, res: Response) =>
		res.send("Hello Skillfusion back"),
	);

	const httpServer = app.listen(PORT, () => {
		console.log(`🚀 Server ready: http://localhost:${PORT}/graphql`);
	});

	return {
		httpServer,
		prisma,
	};
}
if (process.env.NODE_ENV !== "test") {
	await init();
}

// async function testPrisma() {
// 	// await prisma.$queryRaw`SELECT NOW()`
// 	const users = await prisma.user.findMany();
// 	console.log("Prisma ok", users);
// }
// testPrisma();
