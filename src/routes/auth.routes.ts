import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userRepository } from "../repositories";
import { AuthService } from "../services/auth.service";

const router = Router();
const authController = new AuthController(new AuthService(userRepository));

// Rutas de autenticación
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);

export default router;
