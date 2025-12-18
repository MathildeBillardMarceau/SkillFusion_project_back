import assert from "node:assert";
import test from "node:test";
import { init } from "../../src/index.ts";
import { graphqlRequest } from "../helpers/graphqlClient.ts";
import { createTestUser } from "../helpers/user.ts";

let prisma, httpServer;

test.before(async () => {
	process.env.NODE_ENV = "test";
	// démarrer le serveur avant les tests
	const initResult = await init();
	prisma = initResult.prisma;
	httpServer = initResult.httpServer;
});

test.after(async () => {
	// fermer le serveur et Prisma à la fin de tous les tests
	await prisma.$disconnect;
	await prisma.$disconnect();
	httpServer.close();
});

test.beforeEach(async () => {
	// reset la bdd avant chaque test
	await prisma.user.deleteMany();
});
test.afterEach(async () => {
	// reset la bdd après chaque test
	await prisma.user.deleteMany();
});

test("LOGIN — success", async () => {
	// ARRANGE
	try {
		// seed du user
		const email = "login@test.com";
		const password = "Azerty123!";
		await createTestUser({ email, password });

		// ACT
		// requête GraphQL
		const result = await graphqlRequest({
			query: `#graphql
          mutation Login($input: LoginUserInput!) {
            loginUser(input: $input) {
              accessToken
              # refreshToken
              user {
                id
                email
              }
            }
          }
        `,
			variables: {
				input: {
					email,
					password,
				},
			},
		});

		// console.log(JSON.stringify(result, null, 2));

		// ASSERT
		assert.ok(result.data.loginUser.accessToken);
		// assert.ok(result.data.loginUser.refreshToken);
		assert.equal(result.data.loginUser.user.email, "login@test.com");
	} finally {
		//
	}
});

test("LOGIN — fails with invallid password", async () => {
	// ARRANGE

	try {
		// seed du user
		const email = "fail@test.com";
		const password = "Azerty123!";
		await createTestUser({ email, password });

		// ACT
		// requête GraphQL
		const result = await graphqlRequest({
			query: `#graphql
          mutation Login($input: LoginUserInput!) {
            loginUser(input: $input) {
              accessToken
              # refreshToken
              user {
                id
                email
              }
            }
          }
        `,
			variables: {
				input: {
					email,
					password: "Wr0ng-passw0rd!",
				},
			},
		});

		// console.log(JSON.stringify(result, null, 2));

		// ASSERT
		assert.ok(result.errors);
		assert.match(result.errors[0].message, /Unauthorized/);
	} finally {
		//
	}
});
