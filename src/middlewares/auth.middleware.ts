import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env";
import { CustomError } from "../utils/CustomError";

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
    throw new CustomError("Token de autenticación requerido", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch {
    throw new CustomError("Token de autenticación inválido", 401);
  }
}
