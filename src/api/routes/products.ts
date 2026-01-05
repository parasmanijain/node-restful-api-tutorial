import { Router, Request } from "express";
import multer, { diskStorage, FileFilterCallback } from "multer";
import checkAuth from "../middleware/check-auth.js";
import {
  products_create_product,
  products_delete,
  products_get_all,
  products_get_product,
  products_update_product,
} from "../controllers/products.js";

/**
 * Multer storage configuration
 */
const storage = diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb): void => {
    cb(null, "./uploads/");
  },
  filename: (_req: Request, file: Express.Multer.File, cb): void => {
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

const router = Router();

/**
 * Routes
 */
router.get("/", products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  products_create_product
);

router.get("/:productId", products_get_product);

router.patch("/:productId", checkAuth, products_update_product);

router.delete("/:productId", checkAuth, products_delete);

export default router;
