import { Router } from "express";
import { UserController } from "../controllers/usuario.controller";
import { isAdmin } from "../middlewares/user-rol.middleware";
import { validate } from "../middlewares/validate-schema.middleware";
import { updateUsuarioSchema } from "../schemas/usuario.schema";
import { userService } from "../services";

const router = Router();
const userController = new UserController(userService);

router.get("/", isAdmin, userController.getAll);
router.get("/:id", userController.getById);
router.patch("/:id", validate(updateUsuarioSchema), userController.update);
router.delete("/:id", userController.delete);

export default router;
