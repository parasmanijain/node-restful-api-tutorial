import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/product.js";

/**
 * GET /orders
 */
export const orders_get_all = async (
  _req: Request,
  res: Response
): Promise<void> => {
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
};

/**
 * POST /orders
 */
export const orders_create_order = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, quantity } = req.body as {
      productId: string;
      quantity: number;
    };

    const product = await Product.findById(productId).exec();

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
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
};

/**
 * GET /orders/:orderId
 */
export const orders_get_order = async (
  req: Request<{ orderId: string }>,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("product")
      .exec();

    if (!order) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
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
};

/**
 * DELETE /orders/:orderId
 */
export const orders_delete_order = async (
  req: Request<{ orderId: string }>,
  res: Response
): Promise<void> => {
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
};
