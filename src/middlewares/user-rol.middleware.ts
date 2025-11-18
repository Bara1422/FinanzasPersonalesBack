import type { NextFunction, Response } from "express";
import { CustomError } from "../utils/CustomError";
import type { AuthRequest } from "./auth.middleware";

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (!user) {
    throw new CustomError("Usuario no autenticado", 401);
  }

  if (user.rol !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Acceso denegado, Se requiere rol ADMIN" });
  }
  next();
};
