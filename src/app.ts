import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import productRoutes from "./api/routes/products.js";
import orderRoutes from "./api/routes/orders.js";

const app: Application = express();

app.use(morgan("dev"));

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// 404 handler
app.use((_: Request, _2: Response, next: NextFunction) => {
  const error = new Error("Not found");
  (error as any).status = 404; // custom property
  next(error);
});

// Global error handler
app.use(
  (
    error: Error & { status?: number },
    _: Request,
    res: Response,
    _2: NextFunction
  ) => {
    res.status(error.status ?? 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
);

export default app;
