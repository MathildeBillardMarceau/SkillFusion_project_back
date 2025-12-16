export const chapterResolvers = {
	Query: {
		chapters: async (_parent, _args, { prisma }) => {
			return await prisma.chapter.findMany({
				// include: { course: true },
			});
		},
	},

	Mutation: {},
};
