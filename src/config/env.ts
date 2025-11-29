import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    PORT: z
      .string()
      .refine((port) => parseInt(port) > 0 && parseInt(port) < 65536, {
        message: "PORT must be a valid port number between 1 and 65535",
      }),
    CORS_ORIGIN: z
      .string()
      .refine((url) => url.startsWith("http") || url.startsWith("https"), {
        message: "Invalid URL format",
      }),
    JWT_SECRET: z
      .string()
      .min(10, { message: "JWT_SECRET must be at least 10 characters long" }),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    DATABASE_URL: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().optional(),
    FRONTEND_URL: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.NODE_ENV === "production" &&
        (!data.DATABASE_URL || data.DATABASE_URL.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "DATABASE_URL is required in production environment",
      path: ["DATABASE_URL"],
    },
  );

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
