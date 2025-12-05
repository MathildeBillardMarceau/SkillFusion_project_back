import { prisma } from "../../prisma/prismaClient";

export const buildContext = () => {
	return {
		prisma,
	};
};
