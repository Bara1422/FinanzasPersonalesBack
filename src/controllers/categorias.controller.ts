import type { TipoCategoria } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { CategoryService } from "../services/category.service";
import { CustomError } from "../utils/CustomError";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getAllCategories = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  getCategoriesByType = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const tipo = req.params.tipo.toUpperCase() as TipoCategoria;
      if (!tipo || (tipo !== "INGRESO" && tipo !== "GASTO")) {
        throw new CustomError("Tipo de categoría inválido", 400);
      }
      const categories = await this.categoryService.getCategory(tipo);
      return res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id_categoria);
      if (!id) {
        throw new CustomError("ID de categoría inválido", 400);
      }
      const category = await this.categoryService.getById(id);

      return res.json(category);
    } catch (error) {
      next(error);
    }
  };
}
