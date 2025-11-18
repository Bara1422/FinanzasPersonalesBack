import type { Categoria, TipoCategoria } from "@prisma/client";
import prisma from "../../db/prisma";
import type { ICategoryRepository } from "../interfaces/ICategoryRepository";

export class CategoryRepositoryPrisma
  implements ICategoryRepository<Categoria>
{
  async getCategory(tipo: TipoCategoria): Promise<Categoria[]> {
    return await prisma.categoria.findMany({ where: { tipo } });
  }

  async getAllCategories(): Promise<Categoria[]> {
    return await prisma.categoria.findMany();
  }

  async getById(id: number): Promise<Categoria | null> {
    return await prisma.categoria.findUnique({
      where: { id_categoria: id },
    });
  }
}
