import type { Categoria, TipoCategoria } from "@prisma/client";

export interface ICategoryRepository<T extends Categoria> {
  getCategory(tipo: TipoCategoria): Promise<T[]>;
  getAllCategories(): Promise<T[]>;
}
