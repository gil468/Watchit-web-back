import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthResquest extends Request {
  user?: { _id: string };
}
const authMiddleware = (
  req: AuthResquest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as { _id: string };
    next();
  });
};

export default authMiddleware;