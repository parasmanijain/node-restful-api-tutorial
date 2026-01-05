import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import Product from "../models/product.js";

const router = Router();

/**
 * GET /products
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const docs = await Product.find().exec();
    res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

/**
 * POST /products
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const product = new Product({
      _id: new Types.ObjectId(),
      name: req.body.name as string,
      price: req.body.price as number,
    });

    const result = await product.save();

    res.status(201).json({
      message: "Handling POST requests to /products",
      createdProduct: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

/**
 * GET /products/:productId
 */
router.get("/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const doc = await Product.findById(productId).exec();

    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(404).json({
        message: "No valid entry found for provided ID",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

/**
 * PATCH /products/:productId
 */
router.patch("/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const updateOps: Record<string, unknown> = {};
    for (const ops of req.body as Array<{ propName: string; value: unknown }>) {
      updateOps[ops.propName] = ops.value;
    }

    const result = await Product.updateOne(
      { _id: productId },
      { $set: updateOps }
    ).exec();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

/**
 * DELETE /products/:productId
 */
router.delete("/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const result = await Product.deleteOne({ _id: productId }).exec();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
