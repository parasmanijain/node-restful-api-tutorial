import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Extend Express Request to include userData
 */
export interface AuthRequest extends Request {
  userData?: string | JwtPayload;
}

export default (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Auth failed" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const jwtKey = process.env.JWT_KEY;
    if (!jwtKey) {
      res.status(500).json({ message: "JWT_KEY not configured" });
      return;
    }

    const decoded = jwt.verify(token, jwtKey);

    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Auth failed",
    });
  }
};
