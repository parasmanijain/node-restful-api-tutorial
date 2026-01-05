import express from "express";
const app = express();

import productRoutes from "./api/routes/products.js";
import orderRoutes from "./api/routes/orders.js";

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

export default app;
