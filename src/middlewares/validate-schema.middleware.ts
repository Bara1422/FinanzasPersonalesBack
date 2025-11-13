import type { NextFunction, RequestHandler, Response } from "express";
import type { ZodError, ZodSchema } from "zod";
import { CustomError } from "../utils/CustomError";
import type { AuthRequest } from "./auth.middleware";

export const getStatusCodeFromZodError = (error: ZodError): number => {
  const hasTypeError = error.issues.some(
    (issue) => issue.code === "invalid_type" || issue.code === "invalid_key",
  );
  if (hasTypeError) {
    return 400;
  }
  return 422;
};

export const validate =
  <T extends ZodSchema>(
    schema: T,
    source: "body" | "query" | "params" = "body",
  ): RequestHandler =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    const input = req[source];
    const result = schema.safeParse(input);
    if (!result.success) {
      const err = result.error as ZodError;
      const message = err.issues.map((issue) => issue.message).join(", ");

      return next(new CustomError(message, 400));
    }
    req[source] = result.data;
    next();
  };
