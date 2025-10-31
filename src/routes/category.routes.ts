import { Router } from "express";
import { CategoryController } from "../controllers/categorias.controller";
import { categoryRepository } from "../repositories";
import { CategoryService } from "../services/category.service";

const router = Router();
const categoryController = new CategoryController(
  new CategoryService(categoryRepository),
);

router.get("/", categoryController.getAllCategories);
router.get("/:tipo", categoryController.getCategoriesByType);

export default router;
