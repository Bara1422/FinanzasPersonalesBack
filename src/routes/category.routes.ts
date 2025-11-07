import { Router } from "express";
import { CategoryController } from "../controllers/categorias.controller";

import { categoryService } from "../services";

const router = Router();
const categoryController = new CategoryController(categoryService);

router.get("/", categoryController.getAllCategories);
router.get("/:tipo", categoryController.getCategoriesByType);

export default router;
