import { execSync } from "node:child_process";
import test from "node:test";
import { createTestDb, dropTestDb } from "../scripts/test-db.ts";

process.env.NODE_ENV = "test";

test.before(async () => {
	console.log("➡️  Test setup");
	// creation de la bdd
	await createTestDb();

	console.log("🔹 2/3 Applying Prisma schema");
	execSync("pnpm prisma db push", { stdio: "inherit" });
});

test.after(async () => {
	// suppression de la bdd
	await dropTestDb();
});
