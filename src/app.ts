import express, {
  Application,
  Request,
  Response,
  NextFunction,
  urlencoded,
  json,
} from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import productRoutes from "./api/routes/products.js";
import orderRoutes from "./api/routes/orders.js";

const app: Application = express();

/**
 * MongoDB connection
 * (use environment variables in real projects)
 */
const mongoUri = `${process.env.MONGODB_URI}`;

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

/**
 * Middleware
 */
app.use(morgan("dev"));
app.use(urlencoded({ extended: false }));
app.use(json());

/**
 * CORS
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

/**
 * Routes
 */
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

/**
 * 404 handler
 */
app.use((_: Request, _2: Response, next: NextFunction) => {
  const error = new Error("Not found") as Error & { status?: number };
  error.status = 404;
  next(error);
});

/**
 * Global error handler
 */
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
