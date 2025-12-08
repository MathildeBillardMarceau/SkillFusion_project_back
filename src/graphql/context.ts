import { prisma } from "../../prisma/prismaClient.ts";

export const buildContext = () => {
	return {
		prisma,
	};
};
