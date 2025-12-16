export const chapterResolvers = {
	Query: {
		chapters: async (_parent, _args, { prisma }) => {
			return await prisma.chapter.findMany();
		},
	},
	Chapter: {
		medias: async (parent, _args, { prisma }) => {
			const chapterMedia = await prisma.chapterHasMedia.findMany({
				where: { chapterId: parent.id },
				include: { media: true },
			});
			return chapterMedia.map((cm) => cm.media);
		},
	},
};
