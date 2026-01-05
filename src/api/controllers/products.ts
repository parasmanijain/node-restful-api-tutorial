import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/product.js";

/**
 * GET /products
 */
export const products_get_all = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const docs = await Product.find()
      .select("name price _id productImage")
      .exec();

    res.status(200).json({
      count: docs.length,
      products: docs.map((doc) => ({
        name: doc.name,
        price: doc.price,
        productImage: doc.productImage,
        _id: doc._id,
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${doc._id}`,
        },
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/**
 * POST /products
 */
export const products_create_product = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        message: "Product image is required",
      });
      return;
    }

    const { name, price } = req.body as {
      name: string;
      price: number;
    };

    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name,
      price,
      productImage: req.file.path,
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
    res.status(500).json({ error: err });
  }
};

/**
 * GET /products/:productId
 */
export const products_get_product = async (
  req: Request<{ productId: string }>,
  res: Response
): Promise<void> => {
  try {
    const doc = await Product.findById(req.params.productId)
      .select("name price _id productImage")
      .exec();

    if (!doc) {
      res.status(404).json({
        message: "No valid entry found for provided ID",
      });
      return;
    }

    res.status(200).json({
      product: doc,
      request: {
        type: "GET",
        url: "http://localhost:3000/products",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/**
 * PATCH /products/:productId
 */
export const products_update_product = async (
  req: Request<
    { productId: string },
    {},
    Array<{ propName: string; value: unknown }>
  >,
  res: Response
): Promise<void> => {
  try {
    const updateOps: Record<string, unknown> = {};

    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
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
    res.status(500).json({ error: err });
  }
};

/**
 * DELETE /products/:productId
 */
export const products_delete = async (
  req: Request<{ productId: string }>,
  res: Response
): Promise<void> => {
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
    res.status(500).json({ error: err });
  }
};
