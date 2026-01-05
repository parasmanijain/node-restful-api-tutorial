import { Router, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = Router();

/**
 * POST /user/signup
 */
router.post(
  "/signup",
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      const existingUser = await User.findOne({ email }).exec();

      if (existingUser) {
        return res.status(409).json({
          message: "Mail exists",
        });
      }

      const hash = await bcrypt.hash(password, 10);

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        password: hash,
      });

      await user.save();

      res.status(201).json({
        message: "User created",
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }
);

/**
 * DELETE /user/:userId
 */
router.delete(
  "/:userId",
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { userId } = req.params;

      await User.deleteOne({ _id: userId }).exec();

      res.status(200).json({
        message: "User deleted",
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }
);

export default router;
