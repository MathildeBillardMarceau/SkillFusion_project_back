import { hash } from "argon2";
import { prisma } from "../../prisma/prismaClient.ts";

// Création des utilisateurs
await prisma.user.createMany({ data: [
    { firstName: "John2", lastName: "Carpenter2", email: "2john@carpenter.io", password: await hash("Azerty123!") },
    { firstName: "Sarah2", lastName: "Connor2", email: "2sarah@connor.io", password: await hash("Azerty123!") },
    { firstName: "Sarah2", lastName: "Connor2", email: "2sarah+admin@connor.io", password: await hash("Azerty123!"), role: "ADMIN" },
    { firstName: "Al2", lastName: "Beback2", email: "2al@illbeback.io", password: await hash("Azerty123!") },
    { firstName: "Olive2", lastName: "Yew2", email: "2olive@you.io", password: await hash("Azerty123!") },
    { firstName: "Justin2", lastName: "Time2", email: "2justin@ontime.io", password: await hash("Azerty123!") },
    { firstName: "alice", lastName: "fusion", email: "alice@mail.com", password: await hash("Alice123!") },
    { firstName: "Bob", lastName: "fusion", email: "bob@mail.com", password: await hash("Bob123!") },
], skipDuplicates: true, }) // { count: 6 }

// Création des cours
async function getUser(email:string){
	return (await prisma.user.findUnique({where : { email }}))
	
}
const loremIpsum = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, hic aliquid unde expedita minus praesentium sequi iusto ratione a nostrum odit tempora iste perspiciatis cum rem, molestiae laborum, cumque dolorum."
await prisma.course.createMany({ data: [
	{ title: "Title n°1", slug: "title-1", userId: (await getUser("2sarah+admin@connor.io"))!.id, level: "BEGINNER" },
	{ title: "Title n°2", slug: "title-2", userId: (await getUser("2john@carpenter.io"))!.id, level: "INTERMEDIATE" },
	{ title: "Title n°3", slug: "title-3", userId: (await getUser("2sarah@connor.io"))!.id, level: "ADVANCED", image: "https://placehold.co/600x400/png", excerpt: loremIpsum, duration: "2h30", cost: "~100€", material: "tête, épaules, genoux, pieds" },
	{ title: "Title n°4", slug: "title-4", userId: (await getUser("2sarah@connor.io"))!.id, image: "https://placehold.co/600x400/png?text=Cours%20n%C2%B04" },
	{ title: "Title n°5", slug: "title-5", userId: (await getUser("2john@carpenter.io"))!.id, excerpt: loremIpsum },
	{ title: "Title n°6", slug: "title-6", userId: (await getUser("2john@carpenter.io"))!.id },
	{ title: "Title n°7", slug: "title-7", userId: (await getUser("2john@carpenter.io"))!.id },
	{ title: "Title n°8", slug: "title-8", userId: (await getUser("2john@carpenter.io"))!.id },
] })


const courses = await prisma.course.findMany();

await prisma.coursesCard.createMany({
  data: [
    {
      courseId: courses[0].id,
      image: "https://placehold.co/400x300/png?text=Bricolage",
      description: "Apprenez les bases du bricolage facilement et en toute sécurité.",
      date: new Date("2025-12-15T10:00:00Z"),
      category: "AUTRE",
    },
    {
      courseId: courses[1].id,
      image: "https://placehold.co/400x300/png?text=Peinture",
      description: "Techniques de peinture pour débutants et avancés.",
      date: new Date("2025-12-18T14:00:00Z"),
      category: "PEINTURE",
    },
    {
      courseId: courses[2].id,
      image: "https://placehold.co/400x300/png?text=Plomberie",
      description: "Réparer et entretenir vos installations sanitaires.",
      date: new Date("2025-12-20T09:30:00Z"),
      category: "PLOMBERIE",
    },
    {
      courseId: courses[3].id,
      image: "https://placehold.co/400x300/png?text=Électricité",
      description: "Apprenez les bases de l'électricité pour sécuriser vos installations.",
      date: new Date("2025-12-22T11:00:00Z"),
      category: "ELECTRICITE",
    },
    {
      courseId: courses[4].id,
      image: "https://placehold.co/400x300/png?text=Menuiserie",
      description: "Initiez-vous à la menuiserie et réalisez vos premiers meubles.",
      date: new Date("2025-12-25T15:00:00Z"),
      category: "MENUISERIE",
    },
  ],
  skipDuplicates: true,
});
