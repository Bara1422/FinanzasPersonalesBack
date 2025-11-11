import type { TipoCategoria } from "@prisma/client";
import type { Request, Response } from "express";
import type { CategoryService } from "../services/category.service";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getAllCategories = async (_req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener las categorías",
        error: error.message || error,
      });
    }
  };

  getCategoriesByType = async (req: Request, res: Response) => {
    try {
      const tipo = req.params.tipo as TipoCategoria;
      const categories = await this.categoryService.getCategory(tipo);
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener las categorías por tipo",
        error: error.message || error,
      });
    }
  };
}
