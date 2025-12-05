import type { PrismaClient } from "../../../prisma/prismaClient";

export const userResolvers = {
	Query: {
		users: async (
			_parent: null,
			_arrs: null,
			{ prisma }: { prisma: PrismaClient },
		) => {
			return await prisma.user.findMany();
		},
		user: () => {},
	},
};
