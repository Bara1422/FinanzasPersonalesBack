import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware";

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "No autorizado" });
  }
  console.log(user);

  if (user.rol !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Acceso denegado, Se requiere rol ADMIN" });
  }
  next();
};
