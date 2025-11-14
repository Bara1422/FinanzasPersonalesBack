import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/CustomError";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Ya existe un registro con ese valor" });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ message: "Referencia inválida (FK)" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Registro no encontrado" });
    }
  }
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: "Error interno del servidor" });
}
