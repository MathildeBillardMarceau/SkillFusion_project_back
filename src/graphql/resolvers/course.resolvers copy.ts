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
			console.log("updateCourse");
			const { categoriesId, chapters, ...courseData } = input;

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

			// mettre à jour les informations du cours
			const course = await prisma.course.update({
				where: { id },
				data: courseData,
			});

			console.log("course updated:", course);

			// return course;

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
			console.log("categoriesId?.length:", categoriesId?.length);

			// Mise à jour des CHAPTERS
			const safeChapters = chapters ?? [];
			console.log(
				"chapters payload:",
				safeChapters.map((c) => ({ id: c.id, title: c.title })),
			);
			if (safeChapters.length) {
				// 1. récupérer les chapitres existants
				const existingChapters = await prisma.chapter.findMany({
					where: { courseId: id },
					select: { id: true },
				});
				console.log("existingChapters:", existingChapters);
				const existingChapterIds = existingChapters.map((c) => c.id);
				console.log("existingChapterIds:", existingChapterIds);
				// 2. chapitres à créer ou mettre à jour

				const incomingChapterIds = safeChapters
					.filter((c) => c.id)
					.map((c) => c.id);
				console.log("incomingChapterIds:", incomingChapterIds);
				// 3. chapitres à supprimer
				const chaptersToDelete = existingChapterIds.filter(
					(existingId) => !incomingChapterIds.includes(existingId),
				);
				console.log("chaptersToDelete:", chaptersToDelete);
				// 4. supprimer les chapitres non présents dans la mise à jour
				if (chaptersToDelete.length) {
					await prisma.chapter.deleteMany({
						where: { id: { in: chaptersToDelete } },
					});
				}
				console.log("deleted chapters");
				/////////////////////////
				// 5. créer ou mettre à jour les chapitres
				for (const chapterInput of safeChapters) {
					const { id: chapterId, media, ...chapterData } = chapterInput;
					// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
					let chapter;
					if (chapterId && existingChapterIds.includes(chapterId)) {
						// 5.a mettre à jour le chapitre existant
						chapter = await prisma.chapter.update({
							where: { id: chapterId },
							data: chapterData,
						});
						console.log("updated chapter id:", chapterId);
					} else {
						// 5.b créer un nouveau chapitre
						chapter = await prisma.chapter.create({
							data: {
								...chapterData,
								courseId: course.id,
							},
						});
						console.log("createdChapter:", chapter);

						// 6. lier le média si fourni
						/* if (media) {
							const createdMedia = await prisma.media.upsert({
								where: media.id ? { id: media.id } : { url: media.url },
								update: {}, // type: media.type},
								create: {
									...media,
								},
							});
							console.log("createdMedia:", createdMedia);

							// lier le média au chapitre
							await prisma.chapterHasMedia.upsert({
								where: {
									chapterId_mediaId: {
										chapterId: chapter.id,
										mediaId: createdMedia.id,
									},
								},
								update: {},
								create: {
									chapterId: chapter.id,
									mediaId: createdMedia.id,
								},
							});
							console.log("linked media to chapter");
						} */
					}
				}
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
