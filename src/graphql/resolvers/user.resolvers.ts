import { GraphQLError } from "graphql";
import type { PrismaClient } from "../../../prisma/prismaClient";

export const userResolvers = {
	Query: {
		users: async (
			_parent: null,
			_args: null,
			{ prisma }: { prisma: PrismaClient },
		) => {
			return await prisma.user.findMany();
		},
		userById: async (
			_parent: null,
			{ id }: { id: string },
			{ prisma }: { prisma: PrismaClient },
		) => {
			const user = await prisma.user.findUnique({ where: { id } });
			if (!user) {
				throw new GraphQLError("le 'user' n'existe pas", {
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
				});
			}
			return user;
		},
	},
};
