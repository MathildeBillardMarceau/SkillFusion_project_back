import { GraphQLError } from "graphql";
import type { PrismaClient } from "../../../prisma/prismaClient";

export const courseResolvers = {
	Query: {
		courses: async (
			_parent: null,
			_args: null,
			{ prisma }: { prisma: PrismaClient },
		) => {
			return await prisma.course.findMany();
		},
		courseById: async (
			_parent: null,
			{ id }: { id: string },
			{ prisma }: { prisma: PrismaClient },
		) => {
			const course = await prisma.course.findUnique({ where: { id } });
			if (!course) {
				throw new GraphQLError("le 'course' n'existe pas", {
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
				});
			}
			return course;
		},
		courseBySlug: async (
			_parent: null,
			{ slug }: { slug: string },
			{ prisma }: { prisma: PrismaClient },
		) => {
			const course = await prisma.course.findUnique({ where: { slug } });
			if (!course) {
				throw new GraphQLError("le 'course' n'existe pas", {
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
				});
			}
			return course;
		},
	},
};
