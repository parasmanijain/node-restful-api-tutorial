import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import multer, { diskStorage, FileFilterCallback } from "multer";
import checkAuth from "../middleware/check-auth.js";
import Product from "../models/product.js";

const router = Router();

/**
 * Multer storage config
 */
const storage = diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, "./uploads/");
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

/**
 * Multer file filter
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/**
 * Multer upload instance
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

/**
 * GET /products
 */
router.get("/", async (_req: Request, res: Response) => {
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
});

/**
 * POST /products
 */
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Image file is required",
        });
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
  }
);

/**
 * GET /products/:productId
 */
router.get(
  "/:productId",
  async (req: Request<{ productId: string }>, res: Response) => {
    try {
      const doc = await Product.findById(req.params.productId)
        .select("name price _id productImage")
        .exec();

      if (!doc) {
        return res.status(404).json({
          message: "No valid entry found for provided ID",
        });
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
  }
);

/**
 * PATCH /products/:productId
 */
router.patch(
  "/:productId",
  checkAuth,
  async (
    req: Request<
      { productId: string },
      {},
      Array<{ propName: string; value: unknown }>
    >,
    res: Response
  ) => {
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
  }
);

/**
 * DELETE /products/:productId
 */
router.delete(
  "/:productId",
  checkAuth,
  async (req: Request<{ productId: string }>, res: Response) => {
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
  }
);

export default router;
