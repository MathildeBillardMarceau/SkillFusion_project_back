export const config = {
  port: Number.parseInt(getEnv(process.env.PORT, "PORT") || "3333"),
  pguser: getEnv(process.env.PGUSER, "PGUSER"),
  pgpassword: getEnv(process.env.PGPASSWORD, "PGPASSWORD"),
  pgdatabase: getEnv(process.env.PGDATABASE, "PGDATABASE"),
  pghost: getEnv(process.env.PGHOST, "PGHOST"),
  pgport: Number.parseInt(getEnv(process.env.PGPORT, "PGPORT") || "5555"),
};


function getEnv(value: string | undefined, variableName: string) {
  if (!value) { throw new Error(`Missing env variable: ${variableName}`); }
  return value;
}