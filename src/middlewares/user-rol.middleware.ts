import type { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "No autorizado" });
  }
  console.log(user)

  if (user.rol !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Acceso denegado, Se requiere rol ADMIN" });
  }
  next();
};
