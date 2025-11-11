import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { CustomError } from "../utils/CustomError";

export function errorHandler(
  err: ErrorRequestHandler,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: "Error interno del servidor" });
}
