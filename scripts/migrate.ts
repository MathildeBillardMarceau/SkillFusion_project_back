import "dotenv/config";
import { execSync, spawnSync } from "node:child_process";
import readline from "node:readline";
import { Client } from "pg";

// Interface pour récupérer le nom de migration
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Fonction pour vérifier la connexion à PostgreSQL
async function checkDBConnection() {
	const client = new Client({
		connectionString: `${process.env.DATABASE_URL}`,
	});

	try {
		await client.connect();
		console.log("✅ Connexion à la DB réussie !");
	} catch (err) {
		console.error("❌ Impossible de se connecter à la DB :", err.message);
		process.exit(1); // Arrêt immédiat si la DB n'est pas joignable
	} finally {
		await client.end();
	}
}

(async () => {
	// Vérifier la connexion à la DB
	await checkDBConnection();
	// psql -h 127.0.0.1 -p 5433 -U <nom_du_user> -d skillfusion_db_dev

	rl.question("Nom de la migration Prisma : ", (migrationName) => {
		const name = migrationName.trim() || "auto_migration";
		console.log(`\n➡️  Migration: ${name}\n`);

		try {
			// 1️⃣ Reset de la DB avec --force (ignore prompt)
			console.log("🔹 1/5 Reset de la DB...");
			spawnSync("pnpx", ["prisma", "migrate", "reset", "--force"], {
				stdio: "inherit",
			});

			// 2️⃣ Créer et appliquer la migration
			console.log("🔹 2/5 Création et application de la migration...");
			execSync(`pnpx prisma migrate dev --name ${name}`, { stdio: "inherit" });

			// 3️⃣ Générer Prisma Client
			console.log("🔹 3/5 Génération Prisma...");
			execSync("pnpm db:sync", { stdio: "inherit" });

			// 4️⃣ Seed de la DB
			console.log("🔹 4/5 Seed de la DB...");
			execSync("pnpm db:seed", { stdio: "inherit" });

			console.log("\n✅ Migration terminée !");
		} catch (err) {
			console.error("❌ Erreur pendant la mise à jour :", err);
		} finally {
			rl.close();
		}
	});
})();
