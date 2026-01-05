import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = Router();

interface AuthRequestBody {
  email: string;
  password: string;
}

/**
 * POST /user/signup
 */
router.post(
  "/signup",
  async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    try {
      const { email, password } = req.body;

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
 * POST /user/login
 */
router.post(
  "/login",
  async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).exec();

      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      const jwtKey = process.env.JWT_KEY;
      if (!jwtKey) {
        return res.status(500).json({
          message: "JWT_KEY not configured",
        });
      }

      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        jwtKey,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        message: "Auth successful",
        token,
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
  async (req: Request<{ userId: string }>, res: Response) => {
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
