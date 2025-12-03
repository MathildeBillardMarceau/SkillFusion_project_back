export const config = {
  port: Number.parseInt(process.env.PORT || "3000"),
};


function getEnv(value: string | undefined, variableName: string) {
  if (!value) { throw new Error(`Missing env variable: ${variableName}`); }
  return value;
}