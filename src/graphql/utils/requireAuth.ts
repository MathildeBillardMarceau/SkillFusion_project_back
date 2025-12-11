import { GraphQLError } from "graphql";

export function requireAuth(user) {
	if (!user) {
		throw new GraphQLError("Unauthorized", {
			extensions: {
				code: "UNAUTHORIZED",
				http: { status: 401 },
			},
		});
	}
}
