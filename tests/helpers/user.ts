import { hash } from "argon2";
import { prisma } from "../../prisma/prismaClient.ts";

export async function createTestUser({
	email = "test@login.com",
	password = "password123",
} = {}) {
	await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			firstName: "Test",
			lastName: "User",
		},
	});
}
