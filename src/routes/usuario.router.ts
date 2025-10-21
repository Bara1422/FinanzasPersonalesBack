import { Router } from "express";
import { UserController } from "../controllers/usuario.controller";

const router = Router();
const userController = UserController.getInstance();

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
