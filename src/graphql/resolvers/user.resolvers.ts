import { hash, verify } from "argon2";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { ZodError } from 'zod';
import { config } from "../../config.ts";
import { loginUserSchema, registerUserSchema, updateUserSchema } from "../Validation/schemas/user.schema.ts";
import { requireAuth } from "../utils/requireAuth.ts";

export const userResolvers = {
	Query: {
		users: async (_parent, _args, { prisma, connectedUser }) => {
			return await prisma.user.findMany();
		},
		userById: async (_parent, { id }, { prisma, connectedUser }) => {
			requireAuth(connectedUser);

			// ne permettre qu'au user actuel et à un admin de pouvoir mettre à jour
			if (connectedUser.userId !== id && connectedUser.role !== "ADMIN") {
				throw new GraphQLError("Forbidden", {
					extensions: {
						code: "FORBIDDEN",
						http: { status: 403 },
					},
				});
			}

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
			
			const parsedInput = registerUserSchema.safeParse(input);
			if (!parsedInput.success) {
				const errorMessages = (parsedInput.error as ZodError);
				throw new GraphQLError("Invalid input, try a valid email and a strong password. Your name must be at least 2 characters long.", {
					extensions: {
						code: "BAD_USER_INPUT",
						errors: errorMessages,
					},
				});
			}
			const { email, password, firstName, lastName } = parsedInput.data;

			// vérifier si le user existe déjà
			const existingUser = await prisma.user.findUnique({ where: { email } });
			if (existingUser) throw new GraphQLError("Conflict: User already exists",
				{ extensions: {
					code: "CONFLICT",
					http: { status: 409 },
				},
			}
			); // 409

			// hasher le pw
			const hashedPassword = await hash(password as string);

			// créer le user
			const newUser = await prisma.user.create({
				data: { email, password: hashedPassword, firstName, lastName },
			});

			// retourner les infos du user (sans le pw)
			return { ...newUser, password: undefined };
		},
		loginUser: async (_parent, { input }, { prisma, req, res }) => {
			// récupération des arguments

			const parsedInput = loginUserSchema.safeParse(input);
			if (!parsedInput.success) {
				const errorMessages = (parsedInput.error as ZodError);
				throw new GraphQLError("Invalid input", {
					extensions: {
						code: "BAD_USER_INPUT",
						errors: errorMessages,
					},
				});
			}
			const { email, password } = parsedInput.data;

			// récupération du user
			const user = await prisma.user.findUnique({ where: { email } });
			console.log("user?", user);

			// vérifier si le user n'existe pas
			if (!user) throw new Error("Unauthorized: Invalid credentials"); // 401

			try {
				// vérifier que le pw du user correspond au pw hashé de l'input
				const isValidPassword = await verify(user.password, password);
				console.log("isValidPassword?", isValidPassword);
				if (!isValidPassword)
					throw new Error("Unauthorized: Invalid credentials"); // 401
			} catch (e) {
				throw new Error("Unauthorized: Invalid credentials"); // 401
			}

			const accessToken = jwt.sign(
				{ userId: user.id, role: user.role },
				config.JWT_SECRET,
				{ expiresIn: "1h" },
			);

			const refreshToken = jwt.sign(
				{ userId: user.id, role: user.role },
				config.JWT_REFRESH_SECRET,
				{ expiresIn: "2d" },
			);

			res.cookie("refreshToken", refreshToken, {
  		httpOnly: true,
  		//secure: process.env.NODE_ENV === "production",
  		sameSite: "strict",
  		maxAge: 2 * 24 * 60 * 60 * 1000,
			});

			// stocker le refresh token en bdd
			await prisma.user.update({
				where: { id: user.id },
				data: { refreshToken },
			});

			// retourner les infos du user (sans le pw, avec l'accessToken)
			return {
				user: { ...user, password: undefined },
				accessToken,
			};
		},
		updateUser: async (_parent, { id, input }, { prisma, connectedUser }) => {
			requireAuth(connectedUser);
			
			if (connectedUser.userId !== id && connectedUser.role !== "ADMIN") {
				throw new GraphQLError("Forbidden", {
					extensions: {
						code: "FORBIDDEN",
						http: { status: 403 },
					},
				});
			}

			const parsedInput = updateUserSchema.safeParse(input);
			
			if (!parsedInput.success) {
				const errorMessages = (parsedInput.error as ZodError);
				throw new GraphQLError("Invalid input, try a valid email and a first and lastname at least 2 characters long", {
					extensions: {
						code: "BAD_USER_INPUT",
						errors: errorMessages,
					},
				}
  		);
		}

			const { email, lastName, firstName } = parsedInput.data;

			// ne permettre qu'au user actuel et à un admin de pouvoir mettre à jour

			// mettre à jour les informations du user
			const updatedUser = await prisma.user.update({
				where: { id },
				data: parsedInput.data,
			});
			return { ...updatedUser, password: undefined };
		},

		deleteUser: async (_parent, { id }, { prisma }) => {
			// supprimer le user
			await prisma.user.delete({ where: { id } });
			return true;
		},
		refreshToken: async (_parent, _args, { prisma, req, res }) => {
			const refreshToken = req.cookies?.refreshToken;
		
	

	 		// 1. vérifier le refresh token
	 		if (!refreshToken) {
	 			throw new GraphQLError("Missing refresh token", {
	 				extensions: { code: "BAD_REQUEST" },
				});
	 		}

	 		// vérifier sur le refresh token correspon à un user
	 		const user = await prisma.user.findFirst({
	 			where: { refreshToken },
	 		});
	 		if (!user) {
	 			throw new GraphQLError("Invalid refresh token", {
	 				extensions: { code: "UNAUTHORIZED" },
	 			});
	 		}

	 		// vérifier le refresh token
	 		try {
	 			jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
	 		} catch (e) {
	 			throw new GraphQLError("Invalid or expired refresh token", {
	 				extensions: { code: "UNAUTHORIZED" },
	 			});
	 		}

	 		// 2. Créer un nouvel access token
	 		const newAccessToken = jwt.sign(
	 			{ userId: user.id, role: user.role },
	 			config.JWT_SECRET,
	 			{ expiresIn: "1h" },
	 		);

 		// Créer un nouvel refresh token
	 		const newRefreshToken = jwt.sign(
	 			{ userId: user.id, role: user.role },
	 			config.JWT_REFRESH_SECRET,
	 			{ expiresIn: "2d" },
 		);

 		// mettre à jour en bdd
	 		await prisma.user.update({
	 			where: { id: user.id },
	 			data: { refreshToken: newRefreshToken },
	 		});

 		// retourner les infos du user (sans le pw, avec l'accessToken + refreshToken)
 		return {
 			user: { ...user, password: undefined },
			accessToken: newAccessToken,
	// 			refreshToken: newRefreshToken,
	// 		};
	// 	},
	// },
   }
	}}
}
