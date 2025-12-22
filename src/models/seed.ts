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
			avatar: "arnold.png",
		},
		{
			firstName: "Sarah",
			lastName: "Connor",
			email: "sarah@connor.io",
			password: await hash("Azerty123!"),
			avatar: "Manchas.jpg",
		},
		{
			firstName: "Sarah",
			lastName: "Connor ADMIN",
			email: "sarah+admin@connor.io",
			password: await hash("Azerty123!"),
			role: "ADMIN",
			avatar: "sarah.png",
		},
		{
			firstName: "Al",
			lastName: "Beback",
			email: "al@illbeback.io",
			password: await hash("Azerty123!"),
			avatar: "av02.jpg",
		},
		{
			firstName: "Olive",
			lastName: "Yew",
			email: "olive@you.io",
			password: await hash("Azerty123!"),
			avatar: "av03.jpg",
		},
		{
			firstName: "Justin",
			lastName: "Time",
			email: "justin@ontime.io",
			password: await hash("Azerty123!"),
			avatar: "av04.jpg",
		},
		{
			firstName: "alice",
			lastName: "fusion",
			email: "alice@mail.com",
			password: await hash("Alice123!"),
			avatar: "av05.jpg",
		},
		{
			firstName: "Bob",
			lastName: "fusion",
			email: "bob@mail.com",
			password: await hash("Bob123!"),
			avatar: "av06.jpg",
		},
		{
			firstName: "Hello",
			lastName: "world",
			email: "coucou@lol.mdr",
			role: 'INSTRUCTOR',
			password: await hash("Azerty123!"),
			avatar: "av06.jpg",
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
			title: "Title 1",
			slug: "title-1",
			userId: (await getUser("sarah+admin@connor.io"))!.id,
			level: "BEGINNER",
			image: "/images/carrelage.jpg",
		},
		{
			title: "Nico 1",
			slug: "nico-1",
			userId: (await getUser("2john@carpenter.io"))!.id,
			level: "BEGINNER",
			description: "Cours de présentation par Nicolas",
			image: "/images/niveau-a-bulle.jpg",
			duration: "99h99",
			cost: "~99€",
			material: "tête, épaules, patience, obstination, self-control ",
		},
		{
			title: "Title 2",
			slug: "title-2",
			userId: (await getUser("2john@carpenter.io"))!.id,
			level: "INTERMEDIATE",
			image: "/images/mur_beton.jpg",
		},
		{
			title: "Title 3",
			slug: "title-3",
			userId: (await getUser("sarah@connor.io"))!.id,
			level: "ADVANCED",
			image: "/images/plomberie.jpg",
			description: loremIpsum,
			duration: "2h30",
			cost: "~100€",
			material: "tête, épaules, genoux, pieds",
		},
		{
			title: "Title 4",
			slug: "title-4",
			userId: (await getUser("sarah@connor.io"))!.id,
			image: "/images/niveau-a-bulle.jpg",
		},
		{
			title: "Title 5",
			slug: "title-5",
			userId: (await getUser("2john@carpenter.io"))!.id,
			description: loremIpsum,
		},
		{
			title: "Title 6",
			slug: "title-6",
			description: loremIpsum,
			userId: (await getUser("2john@carpenter.io"))!.id,
			image: "/images/tableau_electrique.jpg",
		},
		{
			title: "Title 7",
			slug: "title-7",
			userId: (await getUser("2john@carpenter.io"))!.id,
		},
		{
			title: "Title 8",
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
		{
			name: "électricité",
			description: "desc 1ère cat",
			color: "#e1bf18ff",
		},
		{
			name: "maçonnerie",
			description: "desc 2ème cat",
			color: "#3719b1ff",
		},
		{
			name: "platrerie",
			description: "desc 2ème cat",
			color: "#e31414ff",
		},
		{
			name: "réparations",
			description: "desc 2ème cat",
			color: "#8fee66ff",
		},
		{
			name: "autres",
			description: "desc 2ème cat",
			color: "#66e0eeff",
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

// création des chapitres du cours de Nico
async function seedChapters() {
	const nicoCourse = await prisma.course.findUnique({
		where: { slug: "nico-1" },
	});
	//console.log("nicoCourse ID:", nicoCourse);

	if (!nicoCourse) throw new Error("Cours introuvable !");

	const chapt1 = {
		title: "Nico 101 - introduction",
		description:
			"Ce premier chapitre nous servira uniquement d'introduction, nous ajouterons des titres, du texte et du parapgrahe en HTML",
		text: "<h3>Titre 1</h3><p>Bonjour je suis un texte mais on s'en fiche un peu.</p><p>Et moi un second paragraphe avec des mots en <b>gras</b> et en <i>italique</i></p><h3>Titre 2</h3><p>Nous allons faire des listes</p><ul><li>puce</li><li>pupuce</li><li>repuce</li></ul><h3>Titre 3</h3><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, hic aliquid unde expedita minus praesentium sequi iusto ratione a nostrum odit tempora iste perspiciatis cum rem, molestiae laborum, cumque dolorum.</p>",
	};

	const chapt2 = {
		title: "Nico 102 - images",
		description: "Ce chapitre nous ajouterons des images",
		text: `
    <h3>Image locale</h3>
    <p>Cette image vient de notre dossier public</p>
    <img src="/images/carrelage.jpg" alt="Carrelage" />
		<p> ou depuis public </p>
		<img src="/public/images/carrelage.jpg" alt="Carrelage" />

    <h3>Image du web</h3>
    <p>En direct des interwebez</p>
    <img src="https://urlr.me/8cp7e4" alt="Femme souriante" />
  `,
	};

	const chapt3 = {
		title: "Nico 103 - texte long",
		description: "Non sans raison tombent les feulles de la lorem",
		text: "<h3>Tout d'abord la lorem copiée telle que</h3><p></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra varius varius. Pellentesque consectetur id tortor eu scelerisque. Proin volutpat mauris eros, vel ultrices ligula euismod at. Suspendisse non lectus in risus ultrices ullamcorper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam sit amet cursus leo, et suscipit enim. Donec non commodo sem, ac porta est. Praesent maximus tellus sem, ac varius urna gravida accumsan. In ullamcorper et nibh eget volutpat. Duis consequat rhoncus rutrum. Vestibulum cursus posuere turpis vel ornare. Vivamus id mauris nulla.</p><p>Donec in cursus mauris. In lacinia condimentum ipsum, vel vestibulum sapien placerat a. Aenean eget lectus aliquet diam euismod viverra at fringilla leo. Donec placerat, tellus gravida rhoncus ultrices, diam risus interdum nibh, bibendum faucibus justo turpis id nulla. Nullam ultricies iaculis auctor. Morbi accumsan velit ligula, id auctor arcu mollis nec. Nullam mollis condimentum interdum. Nullam ipsum metus, blandit eget faucibus eget, ultrices a erat. Sed malesuada placerat sapien, at lacinia lacus fringilla a. Maecenas aliquam ligula eu quam convallis, dictum tincidunt risus mollis. Morbi egestas, est sed pellentesque efficitur, ex quam pellentesque ante, accumsan imperdiet mauris eros sit amet nunc. Vestibulum lacinia fermentum tortor, nec fermentum lectus dapibus et.</p><p>Integer quis elit ante. Nam ut diam gravida, luctus augue ut, auctor ipsum. Duis eget odio pretium, lacinia mauris non, mollis massa. Maecenas viverra molestie scelerisque. Pellentesque posuere dictum ligula eget semper. Suspendisse nulla libero, semper eget nisi nec, porttitor consequat risus. Cras tincidunt, lectus nec auctor convallis, lacus nibh tincidunt elit, eu sagittis nisl lectus a velit.</p><p>Nam a tincidunt velit. Nullam sit amet arcu et tellus imperdiet lobortis. Suspendisse potenti. Curabitur dictum ante sed tortor euismod, vel elementum dui luctus. Mauris ornare ligula vel mi laoreet, in varius urna accumsan. Integer faucibus quam at justo hendrerit, non tristique felis sodales. Suspendisse at ante sem. Quisque nisl sapien, facilisis vitae ex vitae, interdum luctus augue.</p><p>Suspendisse tincidunt sodales eros vitae varius. Aliquam in porta eros. Praesent egestas leo at dolor ultricies scelerisque. Quisque quis faucibus turpis, ut lacinia nisl. Donec ac velit accumsan, fermentum ipsum at, viverra quam. Integer ac dui dui. Nam at nisl est. Fusce sit amet luctus libero. Etiam risus eros, euismod sed quam sit amet, molestie rutrum enim. Vestibulum velit massa, rhoncus ac sollicitudin id, volutpat eu arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec vitae arcu elementum, malesuada tellus nec, blandit erat. Nam feugiat ex tristique eleifend rutrum. Nam id euismod sapien. Nunc fringilla maximus convallis.</p><p></p><p><strong>Ensuite la Lorem ou je fais des sauts de lignes</strong></p><p></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra varius varius. Pellentesque consectetur id tortor eu scelerisque. Proin volutpat mauris eros, vel ultrices ligula euismod at. Suspendisse non lectus in risus ultrices ullamcorper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam sit amet cursus leo, et suscipit enim. Donec non commodo sem, ac porta est. Praesent maximus tellus sem, ac varius urna gravida accumsan. In ullamcorper et nibh eget volutpat. Duis consequat rhoncus rutrum. Vestibulum cursus posuere turpis vel ornare. Vivamus id mauris nulla.</p><p></p><p>Donec in cursus mauris. In lacinia condimentum ipsum, vel vestibulum sapien placerat a. Aenean eget lectus aliquet diam euismod viverra at fringilla leo. Donec placerat, tellus gravida rhoncus ultrices, diam risus interdum nibh, bibendum faucibus justo turpis id nulla. Nullam ultricies iaculis auctor. Morbi accumsan velit ligula, id auctor arcu mollis nec. Nullam mollis condimentum interdum. Nullam ipsum metus, blandit eget faucibus eget, ultrices a erat. Sed malesuada placerat sapien, at lacinia lacus fringilla a. Maecenas aliquam ligula eu quam convallis, dictum tincidunt risus mollis. Morbi egestas, est sed pellentesque efficitur, ex quam pellentesque ante, accumsan imperdiet mauris eros sit amet nunc. Vestibulum lacinia fermentum tortor, nec fermentum lectus dapibus et.</p><p></p><p>Integer quis elit ante. Nam ut diam gravida, luctus augue ut, auctor ipsum. Duis eget odio pretium, lacinia mauris non, mollis massa. Maecenas viverra molestie scelerisque. Pellentesque posuere dictum ligula eget semper. Suspendisse nulla libero, semper eget nisi nec, porttitor consequat risus. Cras tincidunt, lectus nec auctor convallis, lacus nibh tincidunt elit, eu sagittis nisl lectus a velit.</p><p></p><p>Nam a tincidunt velit. Nullam sit amet arcu et tellus imperdiet lobortis. Suspendisse potenti. Curabitur dictum ante sed tortor euismod, vel elementum dui luctus. Mauris ornare ligula vel mi laoreet, in varius urna accumsan. Integer faucibus quam at justo hendrerit, non tristique felis sodales. Suspendisse at ante sem. Quisque nisl sapien, facilisis vitae ex vitae, interdum luctus augue.</p><p></p><p>Suspendisse tincidunt sodales eros vitae varius. Aliquam in porta eros. Praesent egestas leo at dolor ultricies scelerisque. Quisque quis faucibus turpis, ut lacinia nisl. Donec ac velit accumsan, fermentum ipsum at, viverra quam. Integer ac dui dui. Nam at nisl est. Fusce sit amet luctus libero. Etiam risus eros, euismod sed quam sit amet, molestie rutrum enim. Vestibulum velit massa, rhoncus ac sollicitudin id, volutpat eu arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec vitae arcu elementum, malesuada tellus nec, blandit erat. Nam feugiat ex tristique eleifend rutrum. Nam id euismod sapien. Nunc fringilla maximus convallis.</p>",
	};

	const chapters = [chapt1, chapt2, chapt3].map((ch) => ({
		...ch,
		courseId: nicoCourse.id,
	}));

	for (const chapter of chapters) {
		await prisma.chapter.create({ data: chapter });
	}

	console.log("✅ - Chapitres ajoutés avec succès !");
}

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
		//console.log("✅messages créés dans un cours :", course);
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
	console.log("✅ - messages créés dans tous les cours ok ");
}

// randomizer de users
function getRandomValue(max) {
	return Math.floor(Math.random() * max);
}

async function randomlyPickedUsers() {
	const allUsers = await prisma.user.findMany({ select: { id: true } });
	// je recherche tous mes users mais je ne prends que les IDs
	const usedValues = new Set();
	// le set est un listing de valeurs pour comparer si les valeurs existent dedans
	const randomizedUsers = [];
	// le tableau qui va recevoir les user et le sort value

	const maxrandom = allUsers.length * 1000;
	// je compte mes valeurs intiales, je les x1000 pour être sur d'avoir une grosse marge pour éviter les doublons

	for (const user of allUsers) {
		let sortValue = getRandomValue(maxrandom);
		// je génère une valeur aléatoire

		while (usedValues.has(sortValue)) {
			// tant que cette valeur aléatoire est déjà dans usedValudes je la regén_re
			sortValue = getRandomValue(maxrandom);
		}
		// j'ajoute enfin ma valeur dans ma liste des valeurs utilisées
		usedValues.add(sortValue);
		// et je push dans mon tableau de sortie user et la valeur de tri
		randomizedUsers.push({ id: user.id, sortValue });
	}
	randomizedUsers.sort((a, b) => a.sortValue - b.sortValue);
	// le sort va permettre de trier dans l'ordre en comparant les sortValue de chaque user

	const nUsersToPick = Math.floor(Math.random() * randomizedUsers.length) + 1;
	// je compte la longueur +1 de randomized users
	const pickedUsers = randomizedUsers.slice(0, nUsersToPick);

	return pickedUsers;
}

async function subscribeToCourse() {
	// je récupère tous les cours existants et pour chaque cours je prends sont id et ses chapters
	const allCourses = await prisma.course.findMany();

	// pour chaque course
	for (const course of allCourses) {
		// j'appelle la fonction qui choisit des users au hasard
		const subscribers = await randomlyPickedUsers();
		// j'init un tableau subscribers dans lequel je map les courseId et userId
		const subscribersData = subscribers.map((user) => ({
			courseId: course.id,
			userId: user.id,
			completion: "",
		}));
		// je map (donc je rajoute) dans ce tableau des objets avec courseId et userId
		await prisma.courseHasSubscriber.createMany({ data: subscribersData });
		// j'envoie ensuite ce tableau dans le createMany ?
		console.log("Inscription à un cours réalisée");
	}
	console.log("✅Inscription à tous les cours ok");
}

async function fillDB() {
	await seedMessages();
	await seedChapters();
	await subscribeToCourse();
}

fillDB();

console.log(`✅ Données d'échantillonnage correctement ajoutées à la BDD.`);
