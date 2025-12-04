import { config } from "./config";
import express from 'express';
import type { Request, Response } from 'express';

export const app = express();

console.log("config:", config);

const PORT = config.port;

app.get("/", (req: Request, res: Response) => res.send ("Hello Skillfusion back"));

app.listen(PORT, () => {
  console.log(`🚀 Server ready: http://localhost:${PORT}`);
});