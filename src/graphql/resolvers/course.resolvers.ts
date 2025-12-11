import { GraphQLError } from "graphql";
import { Level } from "../../../prisma/prismaClient.ts";

export const courseResolvers = {
	Query: {
		// courses
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
		// categories
		categories: async (_parent, _args, { prisma }) => {
			return await prisma.category.findMany();
		},
		categoryById: async (_parent, _args, { prisma }) => {
			return await prisma.category.findMany();
		},
		categoryByName: async (_parent, { name }, { prisma }) => {
			const category = await prisma.category.findUnique({ where: { name } });
			if (!category) {
				throw new GraphQLError("la 'category' n'existe pas", {
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
				});
			}
			return category;
		},
		levels: () => Object.values(Level),
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
		// Category
		createCategory: async (_parent, { input }, { prisma }) => {
			const category = await prisma.category.create({
				data: {
					...input,
				},
			});
			return category;
		},
		updateCategory: async (_parent, { id, input }, { prisma }) => {
			// mettre à jour les informations de la catégorie
			return await prisma.category.update({ where: { id }, data: input });
		},
		deleteCategory: async (_parent, { id }, { prisma }) => {
			// supprimer la catégorie
			await prisma.category.delete({ where: { id } });
			return true;
		},

		// Course
		createCourse: async (_parent, { input }, { prisma }) => {
			const { userId, categoriesId, ...courseData } = input;

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
					...courseData,
					userId,
					// lier les catégories
					// ...(categoriesId && {
					// 	categories: {
					// 		connect: categoriesId.map((id) => ({ id })),
					// 	},
					// }),
				},
			});

			// lier les catégories avec la table de jointure
			if (categoriesId?.length) {
				await prisma.courseHasCategory.createMany({
					data: categoriesId.map((categoryId) => ({
						courseId: course.id,
						categoryId,
					})),
					skipDuplicates: true,
				});
			}

			return course;
		},
		updateCourse: async (_parent, { id, input }, { prisma }) => {
			const { categoriesId, ...courseData } = input;

			// mettre à jour les informations du cours
			const course = await prisma.course.update({
				where: { id },
				data: {
					...courseData,
				},
			});

			// mettre à jour les catégories de la table de jointure
			if (categoriesId?.length) {
				// supprimer les anciennes catégories liées
				await prisma.courseHasCategory.deleteMany({ where: { courseId: id } });
				// ajouter les nouvelles catégories
				await prisma.courseHasCategory.createMany({
					data: categoriesId.map((categoryId) => ({
						courseId: course.id,
						categoryId,
					})),
					skipDuplicates: true,
				});
			}

			return course;
		},
		deleteCourse: async (_parent, { id }, { prisma }) => {
			// supprimer le cours
			await prisma.course.delete({ where: { id } });
			return true;
		},
	},
};
