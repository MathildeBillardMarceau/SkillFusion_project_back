import { Client } from "pg";

const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE, NODE_ENV } =
	process.env;

if (NODE_ENV !== "test") {
	console.error("❌ test-db script can only run in test mode");
	process.exit(1);
}

if (!PGDATABASE?.includes("-test")) {
	console.error("❌ Refusing to run on non-test database:", PGDATABASE);
	process.exit(1);
}

async function getClient() {
	return new Client({
		host: PGHOST,
		port: Number(PGPORT),
		user: PGUSER,
		password: PGPASSWORD,
		database: "postgres", // DB système
	});
}

export async function createTestDb() {
	const client = await getClient();
	await client.connect();

	const exists = await client.query(
		`SELECT 1 FROM pg_database WHERE datname = $1`,
		[PGDATABASE],
	);

	if (exists.rowCount === 0) {
		console.log(`🔹 1/3 Creating test database ${PGDATABASE}`);
		await client.query(`CREATE DATABASE "${PGDATABASE}"`);
	}

	await client.end();
}

export async function dropTestDb() {
	const client = await getClient();
	await client.connect();

	console.log(`🔹 3/3 Dropping test database ${PGDATABASE}`);

	// Forcer la fermeture des connexions
	await client.query(
		`
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = $1
  `,
		[PGDATABASE],
	);

	await client.query(`DROP DATABASE IF EXISTS "${PGDATABASE}"`);
	await client.end();
}
