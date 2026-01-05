import { Request, Response, Router, NextFunction } from "express";
import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/product.js";

const router = Router();

/**
 * GET /orders
 */
router.get("/", async (_: Request, res: Response, _2: NextFunction) => {
  try {
    const docs = await Order.find()
      .select("product quantity _id")
      .populate("product", "name")
      .exec();

    res.status(200).json({
      count: docs.length,
      orders: docs.map((doc) => ({
        _id: doc._id,
        product: doc.product,
        quantity: doc.quantity,
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${doc._id}`,
        },
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/**
 * POST /orders
 */
router.post(
  "/",
  async (
    req: Request<{}, {}, { productId: string; quantity?: number }>,
    res: Response,
    _: NextFunction
  ) => {
    try {
      const product = await Product.findById(req.body.productId).exec();

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity ?? 1,
      });

      const result = await order.save();

      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${result._id}`,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
);

/**
 * GET /orders/:orderId
 */
router.get(
  "/:orderId",
  async (req: Request<{ orderId: string }>, res: Response, _: NextFunction) => {
    try {
      const order = await Order.findById(req.params.orderId)
        .populate("product")
        .exec();

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({
        order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

/**
 * DELETE /orders/:orderId
 */
router.delete(
  "/:orderId",
  async (req: Request<{ orderId: string }>, res: Response, _: NextFunction) => {
    try {
      await Order.deleteOne({ _id: req.params.orderId }).exec();

      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

export default router;
