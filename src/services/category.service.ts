import type { Categoria, TipoCategoria } from "@prisma/client";
import type { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository";

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository<Categoria>) {}
  async getCategory(tipo: TipoCategoria): Promise<Categoria[]> {
    return this.categoryRepository.getCategory(tipo);
  }

  async getAllCategories(): Promise<Categoria[]> {
    return this.categoryRepository.getAllCategories();
  }
}
