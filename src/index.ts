import express from 'express';
import type { Request, Response } from 'express';

const PORT = process.env.PORT || 3333;

export const app = express();

app.get("/", (req: Request, res: Response) => res.send ("Hello Skillfusion back"));

app.listen(PORT, () => {
  console.log(`🚀 Server ready: http://localhost:${PORT}`);
});