export const config = {
  port: Number.parseInt(getEnv(process.env.PORT, "PORT") || "3333"),
  pguser: getEnv(process.env.PGUSER, "PGUSER"),
  pgpassword: getEnv(process.env.PGPASSWORD, "PGPASSWORD"),
  pgdatabase: getEnv(process.env.PGDATABASE, "PGDATABASE"),
  pghost: getEnv(process.env.PGHOST, "PGHOST"),
  pgport: Number.parseInt(getEnv(process.env.PGPORT, "PGPORT") || "5555"),
  DATABASE_URL: `"postgresql://${getEnv(process.env.PGUSER, "PGUSER")}:${getEnv(process.env.PGPASSWORD, "PGPASSWORD")}@${getEnv(process.env.PGHOST, "PGHOST")}:${Number.parseInt(getEnv(process.env.PGPORT, "PGPORT") || "5432")}/${getEnv(process.env.PGDATABASE, "PGDATABASE")}"`
};


function getEnv(value: string | undefined, variableName: string) {
  if (!value) { throw new Error(`Missing env variable: ${variableName}`); }
  return value;
}