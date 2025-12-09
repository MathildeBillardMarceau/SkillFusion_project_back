import { GraphQLError } from "graphql";

export const courseResolvers = {
	Query: {
		courses: async (_parent, _args, { prisma }) => {
			return await prisma.course.findMany();
		},
		courseById: async (_parent, { id }, { prisma }) => {
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
		courseBySlug: async (_parent, { slug }, { prisma }) => {
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
		categories: async (_parent, _args, { prisma }) => {
			return await prisma.category.findMany();
		},
	},
	Course: {
		user: async (parent, _args, { prisma }) => {
			return await prisma.user.findUnique({
				where: { id: parent.userId },
			});
		},
		categories: async (parent, _args, { prisma }) => {
			const courseCategories = await prisma.courseHasCategory.findMany({
				where: { courseId: parent.id },
				include: { category: true },
			});
			return courseCategories.map(
				(courseCatergory) => courseCatergory.category,
			);
		},
	},

	Mutation: {
		createCategory: async (_parent, { input }, { prisma }) => {
			const category = await prisma.category.create({
				data: {
					...input,
				},
			});
			return category;
		},
		createCourse: async (_parent, { input }, { prisma }) => {
			const { userId, categoriesId } = input;

			// vérifier si le user existe
			const user = await prisma.user.findUnique({ where: { id: userId } });
			if (!user)
				throw new GraphQLError("le 'user' n'existe pas", {
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
				});

			// créer le cours et le lier au user (créateur)
			const course = await prisma.course.create({
				data: {
					...input,
					// lier les catégories
					...(categoriesId && {
						categories: {
							connect: categoriesId.map((id) => ({ id })),
						},
					}),
				},
			});

			return course;
		},
	},
};
