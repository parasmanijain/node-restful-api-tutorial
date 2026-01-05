import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
const app = express();
import morgan from "morgan";
import productRoutes from "./api/routes/products.js";
import orderRoutes from "./api/routes/orders.js";

app.use(morgan("dev"));
app.use(urlencoded({ extended: false }));
app.use(json());

app.use((req, res, next) => {
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

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((_, _2, next) => {
  const error = new Error("Not found");
  (error as any).status = 404;
  next(error);
});

app.use(
  (
    error: Error & { status?: number },
    _: Request,
    res: Response,
    _2: NextFunction
  ) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
);

export default app;
