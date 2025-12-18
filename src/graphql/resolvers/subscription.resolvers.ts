export const subscriptionResolvers = {
	Query: {
		subscriptions: async (_parent, _args, { prisma }) => {
			return await prisma.CourseHasSubscriber.findMany({
				include: { user: true, course: true },
			});
		},

		subscriptionByUser: async (_parent, args, { prisma }) => {
			return await prisma.CourseHasSubscriber.findMany({
				where: { userId: args.userId },
				include: { course: true },
			});
		},

		subscriptionByUserAtCourse: async (_parent, args, { prisma }) => {
			return await prisma.CourseHasSubscriber.findMany({
				where: { courseId: args.courseId, userId: args.userId },
			});
		},

		subscriptionByUserAtCourseBySlug: async (_parent, args, { prisma }) => {
			return await prisma.CourseHasSubscriber.findMany({
				where: { userId: args.iserId, course: { slug: args.slug } },
				include: { course: true },
			});
		},
	},

	Mutation: {
		createUserSubscription: async (_parent, { input }, { prisma }) => {
			const subscription = await prisma.CourseHasSubscriber.create({
				data: {
					courseId: input.course,
					userId: input.user,
					completion: input.completion,
				},
				include: { user: true, course: true },
			});
			return subscription;
		},

		updateUserSubscription: async (_parent, { input }, { prisma }) => {
			const subscription = await prisma.CourseHasSubscriber.update({
				where: {
					courseId_userId: { courseId: input.course, userId: input.user },
					// ici on utilise une clef composite courseId_userId composée des deux champs de input
				},
				data: { completion: input.completion },
			});
			return subscription;
		},

		deleteUserSubscription: async (_parent, { input }, { prisma }) => {
			await prisma.CourseHasSubscriber.delete({
				where: {
					courseId_userId: { courseId: input.course, userId: input.user },
				},
			});
			return true;
		},
	},
};
