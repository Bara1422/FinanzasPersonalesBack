import type { Categoria, TipoCategoria } from "@prisma/client";
import type { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository";
import { CustomError } from "../utils/CustomError";

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository<Categoria>) {}
  async getCategory(tipo: TipoCategoria): Promise<Categoria[]> {
    return await this.categoryRepository.getCategory(tipo);
  }

  async getAllCategories(): Promise<Categoria[]> {
    return await this.categoryRepository.getAllCategories();
  }

  async getById(id: number): Promise<Categoria | null> {
    const category = await this.categoryRepository.getById(id);

    if (!category) {
      throw new CustomError("Categoría no encontrada", 404);
    }
    return category;
  }
}
