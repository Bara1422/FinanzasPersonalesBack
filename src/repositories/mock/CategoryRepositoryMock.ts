import type { Categoria, TipoCategoria } from "@prisma/client";
import type { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { categoriasMock } from "./data/categoria.data";

export class CategoryRepositoryMock implements ICategoryRepository<Categoria> {
  private categoriasDB: Categoria[] = categoriasMock;

  async getCategory(tipo: TipoCategoria): Promise<Categoria[]> {
    const categorias = this.categoriasDB.filter((cat) => cat.tipo === tipo);
    return Promise.resolve(categorias);
  }

  async getAllCategories(): Promise<Categoria[]> {
    return Promise.resolve(this.categoriasDB);
  }
}
