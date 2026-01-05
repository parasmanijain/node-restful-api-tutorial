import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Product, { Product as ProductType } from "../models/product.js";

const router = express.Router();

/**
 * GET /products
 */
router.get("/", async (_: Request, res: Response, _2: NextFunction) => {
  try {
    const docs = await Product.find().select("name price _id").exec();

    const response = {
      count: docs.length,
      products: docs.map((doc) => ({
        name: doc.name,
        price: doc.price,
        _id: doc._id,
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${doc._id}`,
        },
      })),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

/**
 * POST /products
 */
router.post(
  "/",
  async (
    req: Request<{}, {}, { name: string; price: number }>,
    res: Response,
    _: NextFunction
  ) => {
    try {
      const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
      });
      const result = await product.save();
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${result._id}`,
          },
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
);

/**
 * GET /products/:productId
 */
router.get(
  "/:productId",
  async (
    req: Request<{ productId: string }>,
    res: Response,
    _: NextFunction
  ) => {
    try {
      const doc = await Product.findById(req.params.productId)
        .select("name price _id")
        .exec();

      if (!doc) {
        return res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
      res.status(200).json({
        product: doc,
        request: {
          type: "GET",
          url: "http://localhost:3000/products",
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
);

/**
 * PATCH /products/:productId
 */
router.patch(
  "/:productId",
  async (
    req: Request<
      { productId: string },
      {},
      Array<{ propName: keyof ProductType; value: unknown }>
    >,
    res: Response,
    _: NextFunction
  ) => {
    try {
      const updateOps: Partial<ProductType> = {};

      for (const ops of req.body) {
        updateOps[ops.propName] = ops.value as any;
      }

      await Product.updateOne(
        { _id: req.params.productId },
        { $set: updateOps }
      ).exec();

      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${req.params.productId}`,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
);

/**
 * DELETE /products/:productId
 */
router.delete(
  "/:productId",
  async (
    req: Request<{ productId: string }>,
    res: Response,
    _: NextFunction
  ) => {
    try {
      await Product.deleteOne({ _id: req.params.productId }).exec();

      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" },
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
);

export default router;
