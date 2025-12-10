import { hash, verify } from "argon2";
import { GraphQLError } from "graphql";
import jwt from 'jsonwebtoken';

export const userResolvers = {
	Query: {
		users: async (_parent, _args, { prisma }) => {
			return await prisma.user.findMany();
		},
		userById: async (_parent, { id }, { prisma }) => {
			const user = await prisma.user.findUnique({ where: { id } });
			if (!user) {
				throw new GraphQLError("le 'user' n'existe pas", {
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
				});
			}
			return user;
		},
	},
	User: {
		courses: async (parent, _args, { prisma }) => {
			return await prisma.course.findMany({
				where: { userId: parent.id },
			});
		},
	},
	Mutation: {
		registerUser: async (_parent, { input }, { prisma }) => {
			// récupération des arguments
			const { email, password, firstName, lastName } = input;

			// TODO: validation des arguments (zod)

			// vérifier si le user existe déjà
			const existingUser = await prisma.user.findUnique({ where: { email } });
			if (existingUser) throw Error("Conflict: User already exists"); // 409

			// hasher le pw
			const hashedPassord = await hash(password);

			// créer le user
			const newUser = await prisma.user.create({
				data: { email, password: hashedPassord, firstName, lastName },
				omit: { password: true }, // on ne renvoie pas le pw
			});

			// retourner les infos du user (sans le pw)
			return newUser;
		},
		loginUser: async (_parent, { input }, { prisma }) => {
			// récupération des arguments
			const { email, password } = input;

			// TODO: validation des arguments (zod)

			// récupération du user
			const user = await prisma.user.findUnique({ where: { email } });
			console.log("user?", user);

			// vérifier si le user n'existe pas
			if (!user) throw new Error("Unauthorizerd: Invalid credentials"); // 401

			try {
				// vérifier que le pw du user correspond au pw hashé de l'input
				const isValidPassword = await verify(user.password, password);
				console.log("isValidPassword?", isValidPassword);
				if (!isValidPassword)
					throw new Error("Unauthorized: Invalid credentials"); // 401
			} catch (e) {
				throw new Error("Unauthorizerd: Invalid credentials"); // 401
			}

			const accessToken = jwt.sign(
				{ userId: user.id, role: user.role },
				process.env.JWT_SECRET!,
				{ expiresIn: "1h" }
			);

			// retourner les infos du user (sans le pw, avec l'accessToken)
			return { user: { ...user, password: undefined }, accessToken };
		},
		updateUser: async (_parent, { id, input }, { prisma }) => {
			// mettre à jour les informations du user
			await prisma.user.update({ where: { id }, data: input });
		},
		deleteUser: async (_parent, { id }, { prisma }) => {
			// supprimer le user
			await !!prisma.user.delete({ where: { id } });
		},
	},
};
