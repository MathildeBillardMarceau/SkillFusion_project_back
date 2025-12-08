export type CourseType = {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	image: string;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	duration: string;
	cost: string;
	material: string;
	publishedAt: string;
	createdAt: string;
	updatedAt: string;

	userId: string;
};

export type UserType = {
	id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: "APPRENTICE" | "INSTRUCTOR" | "ADMIN";
	status: "PENDING" | "APPROVED" | "BANNED";

	createdAt: string;
	updatedAt: string;
};
