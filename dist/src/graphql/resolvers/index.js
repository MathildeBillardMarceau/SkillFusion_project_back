import { courseResolvers } from "./course.resolvers.js";
import { scalarResolvers } from "./scalar.resolvers.js";
import { userResolvers } from "./user.resolvers.js";
export const resolvers = [scalarResolvers, courseResolvers, userResolvers];
