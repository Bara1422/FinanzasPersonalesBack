import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate-schema.middleware";
import { createUsuarioSchema } from "../schemas/usuario.schema";
import { authService, userService } from "../services";

const router = Router();
const authController = new AuthController(authService, userService);

// Rutas de autenticación
router.post(
  "/register",
  validate(createUsuarioSchema),
  authController.register,
);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);

export default router;
