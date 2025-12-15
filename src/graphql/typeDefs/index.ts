import { chapterTypeDefs } from "./chapter.typeDefs.ts";
import { courseTypeDefs } from "./course.typeDefs.ts";
import { messageTypeDefs } from "./message.typeDefs.ts";
import { scalarTypeDefs } from "./scalar.typeDefs.ts";
import { userTypeDefs } from "./user.typeDefs.ts";

export const typeDefs = [
	scalarTypeDefs,
	chapterTypeDefs,
	courseTypeDefs,
	userTypeDefs,
	messageTypeDefs,
];
