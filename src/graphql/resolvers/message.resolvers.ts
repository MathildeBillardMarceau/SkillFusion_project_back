export const messageResolvers = {
	Query: {
		//messages (va nous sortir tous les messages)
		messages: async (_parent, _args, { prisma }) => {
			return await prisma.message.findMany({
				include: { user: true, course: true },
			});
		},

		messagesByCourse: async (_parent, args, { prisma }) => {
			const messages = await prisma.message.findMany({
				where: { courseId: args.id },
				include: { user: true },
			});
			return messages;
		},
		// je vais envoyer dans args l'id du cours pour avoir les messages par cours
		// je vais récupérer dans messages la requête findMany
		// je vais filtrer (et pas joindre) donc je vais utiliser le champ physique courseId
		// je vais joindre les infos du posteur, donc je vais utiliser la relation virtuelle user

		messagesByUser: async (__parent, args, { prisma }) => {
			const messages = await prisma.message.findMany({
				where: { userId: args.id },
				include: { course: true },
			});
			return messages;
		},
		// fonction jumelle de la précédente
	},
};
