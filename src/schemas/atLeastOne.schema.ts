import type { z } from "zod";

export const atLeastOne = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return schema.partial().refine(
    (data) => {
      const values = Object.values(data);
      return values.some(
        (value) => value !== undefined && value !== null && value !== "",
      );
    },
    {
      message: "Debe proporcionar al menos un campo para actualizar",
    },
  );
};
