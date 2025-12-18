import { GraphQLError } from "graphql";
import { ZodError } from "zod";
import { createMessageSchema, updateMessageSchema } from "../Validation/schemas/message.schema.ts";

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

		// fonction jumelle de la précédente
		messagesByUser: async (__parent, args, { prisma }) => {
			const messages = await prisma.message.findMany({
				where: { userId: args.id },
				include: { course: true },
			});
			// ajout d'un controle d'erreur si rien n'es retourné
			if (!messages) {
				throw new GraphQLError("Message(s) non trouvé(s)", {
					// utilisation de la classe GraphQLError qui se retrouve importée en début de fichier
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
					// les extensions servent à définir les retours qui sont faits à la machine requêtante
				});
			}
			return messages;
		},

		messagesByCourseSlug: async (_parent, { slug }, { prisma }) => {
			const messages = await prisma.message.findMany({
				where: {
					course: { slug: slug },
				},
				include: { user: true, course: true },
			});
			if (!messages) {
				throw new GraphQLError("Message(s) non trouvé(s)", {
					// utilisation de la classe GraphQLError qui se retrouve importée en début de fichier
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
					// les extensions servent à définir les retours qui sont faits à la machine requêtante
				});
			}
			return messages;
		},
	},

	Mutation: {
		createMessage: async (_parent, { input }, { prisma }) => {

			const parsedInput = createMessageSchema.safeParse(input);
						
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


			// fonctionne comme au-dessus
			// note je "perds" la majuscule de CreateMessage - Majuscule = type, minuscule = resolver
			// j'utilise input au lieu de args
			// input correspond au input CreateMessage défini dans les typeDefs
			const message = await prisma.message.create({
				data: { ...input }, // ici c'est une destructuration de l'input (ou spread opérator): comme mes champs correspondent en nom entre GraphQL et Prisma il vont correspondre sans avoir besoin de les préciser
				include: { user: true, course: true }, // il est nécéssaire d'include user et course car la destructuration impose de les
			});
			return message;
		},

		updateMessage: async (_parent, { id, input }, { prisma }) => {
				
			
			const parsedInput = updateMessageSchema.safeParse(input);
						
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
		
			
			// ici on utilisera id et input - alors que id n'est pas défini dans l'input
			// on remarque que le second champ de la requête correspond à la partie entre parenthèses dans le type Mutation du .typeDefs.ts C'est de là que vient l'id
			const message = await prisma.message.update({
				where: { id },
				data: parsedInput,
			});
			return message;
		},

		deleteMessage: async (_parent, { id }, { prisma }) => {
			await prisma.message.delete({ where: { id } });
			return true;
		},
	},
};
