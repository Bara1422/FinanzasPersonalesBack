import { Router } from "express";
import { UserController } from "../controllers/usuario.controller";
import { isAdmin } from "../middlewares/user-rol.middleware";
import { userService } from "../services";

const router = Router();
const userController = new UserController(userService);

router.get("/", isAdmin, userController.getAll);
router.get("/:id", userController.getById);
router.patch("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
