import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env";


interface TokenPayload extends JwtPayload {
  id_usuario: number;
  rol: string;
}

export interface AuthRequest extends Request {
  user: TokenPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no válido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token no válido" });
  }
}
