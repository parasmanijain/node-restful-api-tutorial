import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import checkAuth from "../middleware/check-auth.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

const router = Router();

/**
 * GET /orders
 */
router.get("/", checkAuth, async (_req: Request, res: Response) => {
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
router.post("/", checkAuth, async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body as {
      productId: string;
      quantity: number;
    };

    const product = await Product.findById(productId).exec();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      quantity,
      product: productId,
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
    res.status(500).json({ error: err });
  }
});

/**
 * GET /orders/:orderId
 */
router.get(
  "/:orderId",
  checkAuth,
  async (req: Request<{ orderId: string }>, res: Response) => {
    try {
      const order = await Order.findById(req.params.orderId)
        .populate("product")
        .exec();
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
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
  checkAuth,
  async (req: Request<{ orderId: string }>, res: Response) => {
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
