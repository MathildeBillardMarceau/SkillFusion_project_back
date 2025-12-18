import assert from "node:assert";
import test from "node:test";
import { init } from "../../src/index.ts";
import { graphqlRequest } from "../helpers/graphqlClient.ts";
import { createTestUser } from "../helpers/user.ts";

test("LOGIN — success", async () => {
	process.env.NODE_ENV = "test";

	// ARRANGE
	// démarrer le serveur
	const { httpServer, prisma } = await init();

	try {
		// nettoyage DB
		await prisma.user.deleteMany();

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
              # accessToken
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
		// assert.ok(json.data.loginUser.accessToken);
		// assert.ok(json.data.loginUser.refreshToken);
		assert.equal(result.data.loginUser.user.email, "login@test.com");
	} finally {
		// cleanup
		await prisma.user.deleteMany();
		await prisma.$disconnect();
		httpServer.close();
	}
});
