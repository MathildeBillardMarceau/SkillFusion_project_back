import { chapterResolvers } from "./chapter.resolvers.ts";
import { courseResolvers } from "./course.resolvers.ts";
import { messageResolvers } from "./message.resolvers.ts";
import { scalarResolvers } from "./scalar.resolvers.ts";
import { subscriptionResolvers } from "./subscription.resolvers.ts";
import { userResolvers } from "./user.resolvers.ts";

export const resolvers = [
	scalarResolvers,
	chapterResolvers,
	courseResolvers,
	userResolvers,
	messageResolvers,
	subscriptionResolvers,
];
