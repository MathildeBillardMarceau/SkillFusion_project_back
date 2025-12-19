export const config = {
	PORT: Number.parseInt(getEnv(process.env.PORT, "PORT") || "3333"),
	PGUSER: getEnv(process.env.PGUSER, "PGUSER"),
	PGPASSWORD: getEnv(process.env.PGPASSWORD, "PGPASSWORD"),
	PGDATABASE: getEnv(process.env.PGDATABASE, "PGDATABASE"),
	PGHOST: getEnv(process.env.PGHOST, "PGHOST"),
	PGPORT: Number.parseInt(getEnv(process.env.PGPORT, "PGPORT") || "5555"),
	DATABASE_URL: `postgresql://${getEnv(process.env.PGUSER, "PGUSER")}:${getEnv(process.env.PGPASSWORD, "PGPASSWORD")}@${getEnv(process.env.PGHOST, "PGHOST")}:${Number.parseInt(getEnv(process.env.PGPORT, "PGPORT") || "5432")}/${getEnv(process.env.PGDATABASE, "PGDATABASE")}`,
	JWT_SECRET: getEnv(process.env.JWT_SECRET, "JWT_SECRET"),
	JWT_REFRESH_SECRET: getEnv(
		process.env.JWT_REFRESH_SECRET,
		"JWT_REFRESH_SECRET",
	),
};

function getEnv(value: string | undefined, variableName: string) {
	if (!value) {
		throw new Error(`Missing env variable: ${variableName}`);
	}
	return value;
}
