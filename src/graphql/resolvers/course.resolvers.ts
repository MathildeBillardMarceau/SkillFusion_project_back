import { GraphQLError } from "graphql";
import { ZodError } from "zod";
import { Level } from "../../../prisma/prismaClient.ts";
import { createCategorySchema, createCourseSchema, updateCategorySchema, updateCourseSchema } from "../Validation/schemas/course.schema.ts";

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
			/* const course = */ return await prisma.course.findUnique({
				where: { slug },
			});
			/* if (!course) {
				throw new GraphQLError("le 'course' n'existe pas", {
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
				});
			}
			return course; */
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
		chapters: async (parent, _args, { prisma }) => {
			return await prisma.chapter.findMany({
				where: { courseId: parent.id },
			});
		},
	},

	Mutation: {
		// Category
		createCategory: async (_parent, { input }, { prisma }) => {
		
			const parsedInput = createCategorySchema.safeParse(input);
						
				if (!parsedInput.success) {
					const errorMessages = (parsedInput.error as ZodError);
					throw new GraphQLError("Invalid input", {
							extensions: {
								code: "BAD_USER_INPUT",
								errors: errorMessages,
							},
						}
					);
				}
			
			const category = await prisma.category.create({
				data: 
					parsedInput.data,
				
			});
			return category;
		},
		updateCategory: async (_parent, { id, input }, { prisma }) => {

			const parsedInput = updateCategorySchema.safeParse(input);
						
				if (!parsedInput.success) {
					const errorMessages = (parsedInput.error as ZodError);
					throw new GraphQLError("Invalid input", {
							extensions: {
								code: "BAD_USER_INPUT",
								errors: errorMessages,
							},
						}
					);
				}
						
			// mettre à jour les informations de la catégorie
			return await prisma.category.update({ where: { id }, data: parsedInput });
		},
		deleteCategory: async (_parent, { id }, { prisma }) => {
			// supprimer la catégorie
			await prisma.category.delete({ where: { id } });
			return true;
		},
		
		// Course
		createCourse: async (_parent, { input }, { prisma }) => {

			const parsedInput = createCourseSchema.safeParse(input);
									
					if (!parsedInput.success) {
						const errorMessages = (parsedInput.error as ZodError);
						throw new GraphQLError("Invalid input", {
								extensions: {
									code: "BAD_USER_INPUT",
									errors: errorMessages,
								},
							}
						);
					}
					
			const { userId, categoriesId, chapters, ...courseData } = input;
			
			// vérifier si le user existe
			const user = await prisma.user.findUnique({ where: { id: userId } });
			if (!user)
				throw new GraphQLError("le 'user' n'existe pas", {
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
				});

			// vérifier si le slug existe déjà
			const existingSlug = await prisma.course.findUnique({
				where: { slug: courseData.slug },
			});
			if (existingSlug) {
				throw new GraphQLError("le 'slug' existe déjà", {
					extensions: {
						code: "BAD USER INPUT",
						http: { status: 400 },
					},
				});
			}

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
					// lier les chapitres
					/* ...(chapters?.length && {
						chapters: {
							create: chapters,
							
					// 		create: chapters.map((chapter, index) => ({
          //   title: chapter.title,
          //   description: chapter.description,
          //   text: chapter.text,
          //   order: chapter.order ?? index + 1, // sécurité
          // })),
							
						},
					}), */
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

			// lier les chapitres au cours
			if (chapters?.length) {
				for (const chapterInput of chapters) {
					const { media, ...chapterData } = chapterInput;

					const createdChapter = await prisma.chapter.create({
						data: {
							...chapterData,
							courseId: course.id,
						},
					});

					// lier le média si fourni
					if (media) {
						const createdMedia = await prisma.media.upsert({
							where: media.id ? { id: media.id } : { url: media.url },
							update: {},
							create: {
								...media,
							},
						});
						// lier le média au chapitre
						await prisma.chapterHasMedia.create({
							data: {
								chapterId: createdChapter.id,
								mediaId: createdMedia.id,
							},
						});
					}
				}
			}

			return course;
		},
		updateCourse: async (_parent, { id, input }, { prisma }) => {
				
			const parsedInput = updateCourseSchema.safeParse(input);
									
				if (!parsedInput.success) {
					const errorMessages = (parsedInput.error as ZodError);
					throw new GraphQLError("Invalid input", {
							extensions: {
								code: "BAD_USER_INPUT",
								errors: errorMessages,
							},
						}
					);
				}


			// vérifier si le slug existe déjà
			// const existingSlug = await prisma.course.findUnique({
			// 	where: { slug: courseData.slug },
			// });
			// if (existingSlug) {
			// 	throw new GraphQLError("le 'slug' existe déjà", {
			// 		extensions: {
			// 			code: "BAD USER INPUT",
			// 			http: { status: 400 },
			// 		},
			// 	});
			// }
			
      
      const { categoriesId} = input;
			// mettre à jour les informations du cours
			const course = await prisma.course.update({
				where: { id },
				data: {
					parsedInput,
				},

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
			// console.log("categoriesId?.length:", categoriesId?.length);

			// chapters: supprimer tous les chapitres liés au cours
			await prisma.chapter.deleteMany({
				where: { courseId: id },
			});

			// Recréation des chapitres liés
			if (chapters?.length) {
				for (const chapterInput of chapters) {
					const { media, ...chapterData } = chapterInput;

					const chapter = await prisma.chapter.create({
						data: {
							...chapterData,
							courseId: id,
						},
					});

					if (media) {
						const mediaEntity = await prisma.media.upsert({
							where: { url: media.url },
							update: {},
							create: media,
						});

						await prisma.chapterHasMedia.create({
							data: {
								chapterId: chapter.id,
								mediaId: mediaEntity.id,
							},
						});
					}
				}
			}
			// console.log("chapters recreated");

			return course;
		},
		deleteCourse: async (_parent, { id }, { prisma }) => {
			// supprimer le cours
			await prisma.course.delete({ where: { id } });
			return true;
		},
	},
};
