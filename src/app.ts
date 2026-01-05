import express, { Request, Response } from "express";

const app = express();

app.use((_: Request, res: Response) => {
  res.status(200).json({
    message: "It works!",
  });
});

export default app;
