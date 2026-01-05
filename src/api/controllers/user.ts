import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 * POST /user/signup
 */
export const user_signup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      res.status(409).json({
        message: "Mail exists",
      });
      return;
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
};

/**
 * POST /user/login
 */
export const user_login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.status(401).json({
        message: "Auth failed",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        message: "Auth failed",
      });
      return;
    }

    const jwtKey = process.env.JWT_KEY;
    if (!jwtKey) {
      res.status(500).json({
        message: "JWT_KEY not configured",
      });
      return;
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
};

/**
 * DELETE /user/:userId
 */
export const user_delete = async (
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> => {
  try {
    await User.deleteOne({ _id: req.params.userId }).exec();

    res.status(200).json({
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};
