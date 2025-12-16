import { hash } from "argon2";
import { prisma } from "../../prisma/prismaClient.ts";

// Création des utilisateurs
await prisma.user.createMany({
	data: [
		{
			firstName: "John2",
			lastName: "Carpenter2",
			email: "2john@carpenter.io",
			password: await hash("Azerty123!"),
		},
		{
			firstName: "Sarah2",
			lastName: "Connor2",
			email: "2sarah@connor.io",
			password: await hash("Azerty123!"),
		},
		{
			firstName: "Sarah2",
			lastName: "Connor2",
			email: "2sarah+admin@connor.io",
			password: await hash("Azerty123!"),
			role: "ADMIN",
		},
		{
			firstName: "Al2",
			lastName: "Beback2",
			email: "2al@illbeback.io",
			password: await hash("Azerty123!"),
		},
		{
			firstName: "Olive2",
			lastName: "Yew2",
			email: "2olive@you.io",
			password: await hash("Azerty123!"),
		},
		{
			firstName: "Justin2",
			lastName: "Time2",
			email: "2justin@ontime.io",
			password: await hash("Azerty123!"),
		},
		{
			firstName: "alice",
			lastName: "fusion",
			email: "alice@mail.com",
			password: await hash("Alice123!"),
		},
		{
			firstName: "Bob",
			lastName: "fusion",
			email: "bob@mail.com",
			password: await hash("Bob123!"),
		},
	],
	skipDuplicates: true,
}); // { count: 6 }

// Création des cours
async function getUser(email: string) {
	return await prisma.user.findUnique({ where: { email } });
}

const loremIpsum =
	"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, hic aliquid unde expedita minus praesentium sequi iusto ratione a nostrum odit tempora iste perspiciatis cum rem, molestiae laborum, cumque dolorum.";
await prisma.course.createMany({
	data: [
		{
			title: "Title n°1",
			slug: "title-1",
			userId: (await getUser("2sarah+admin@connor.io"))!.id,
			level: "BEGINNER",
			image: "/images/carrelage.jpg",
		},
		{
			title: "Title n°2",
			slug: "title-2",
			userId: (await getUser("2john@carpenter.io"))!.id,
			level: "INTERMEDIATE",
			image: "/images/mur_beton.jpg",
		},
		{
			title: "Title n°3",
			slug: "title-3",
			userId: (await getUser("2sarah@connor.io"))!.id,
			level: "ADVANCED",
			image: "/images/plomberie.jpg",
			description: loremIpsum,
			duration: "2h30",
			cost: "~100€",
			material: "tête, épaules, genoux, pieds",
		},
		{
			title: "Title n°4",
			slug: "title-4",
			userId: (await getUser("2sarah@connor.io"))!.id,
			image: "/images/niveau-a-bulle.jpg",
		},
		{
			title: "Title n°5",
			slug: "title-5",
			userId: (await getUser("2john@carpenter.io"))!.id,
			description: loremIpsum,
		},
		{
			title: "Title n°6",
			slug: "title-6",
			description: loremIpsum,
			userId: (await getUser("2john@carpenter.io"))!.id,
			image: "/images/tableau_electrique.jpg",
		},
		{
			title: "Title n°7",
			slug: "title-7",
			userId: (await getUser("2john@carpenter.io"))!.id,
		},
		{
			title: "Title n°8",
			slug: "title-8",
			userId: (await getUser("2john@carpenter.io"))!.id,
		},
	],
});

// Création des categories
await prisma.category.createMany({
	data: [
		{
			name: "menuiserie",
			description: "desc 1ère cat",
			color: "#FF6600",
		},
		{
			name: "plomberie",
			description: "desc 2ème cat",
			color: "#ee66ee",
		},
	],
});

// Création de chapitres
await prisma.chapter.createMany({
	data: [
		{
			title: "chapitre n°1",
			description: "desc 1ère chapitre",
			text: "<p>contenu du chapitre 1</p>",
			courseId: (await getCourse("title-1"))!.id,
		},
		{
			title: "chapitre n°2",
			description: "desc 2ème chapitre",
			text: "<p>contenu du chapitre 2</p>",
			courseId: (await getCourse("title-1"))!.id,
		},
	],
});

async function getCategory(name: string) {
	return await prisma.category.findUnique({ where: { name } });
}
async function getCourse(slug: string) {
	return await prisma.course.findUnique({ where: { slug } });
}

await prisma.courseHasCategory.createMany({
	data: [
		{
			courseId: (await getCourse("title-1"))!.id,
			categoryId: (await getCategory("menuiserie"))!.id,
		},
		{
			courseId: (await getCourse("title-2"))!.id,
			categoryId: (await getCategory("plomberie"))!.id,
		},
	],
});

// creation des messages
async function seedMessages() {
	// récupérer un tableau de tous les users
	const allUsers = await prisma.user.findMany();
	const allCourses = await prisma.course.findMany();

	// pour chaque cours, faire un message de chaque user disant "message de X dans cours Y"
	for (const course of allCourses) {
		for (const user of allUsers) {
			await prisma.message.create({
				data: {
					content: `Bonjour, je suis ${user.firstName} ${user.lastName} et mon message dans le cours ${course.title} est à présent gravé pour sauve l'humanité et le futur: je suis ton père, suis-moi si tu veux vivre, la grande tempête elle approche, hasta la vista baby`,
					userId: user.id,
					courseId: course.id,
				},
			});
		}
		console.log("✅messages créés dans un cours :", course);
	}

	// version plus complexe pour un second message
	const messages = [];
	for (const course of allCourses) {
		for (const user of allUsers) {
			messages.push({
				content: `I'll be back - enfin non I am back en fait... zut ça marche pas <br> Bon I'll be back-end alors!`,
				userId: user.id,
				courseId: course.id,
			});
		}
	}
	await prisma.message.createMany({ data: messages });
	console.log("✅ messages créés dans tous les cours ok ");
}
seedMessages();

console.log(`✅ Données d'échantillonnage correctement ajoutées à la BDD.`);
