import { Router } from "express";
import { UserController } from "../controllers/usuario.controller";
import { isAdmin } from "../middlewares/user-rol.middleware";
import { userRepository } from "../repositories";
import { UserService } from "../services/usuario.service";

const router = Router();
const userController = new UserController(new UserService(userRepository));

router.get("/", isAdmin, userController.getAll);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
