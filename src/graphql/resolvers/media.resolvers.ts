export const mediaResolvers = {
	Query: {
		medias: async (_parent, _args, { prisma }) => {
			return await prisma.media.findMany();
		},
	},
};
