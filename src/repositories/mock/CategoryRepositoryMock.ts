import type { Categoria, TipoCategoria } from "@prisma/client";
import type { ICategoryRepository } from "../interfaces/ICategoryRepository";

export const MOCK_CATEGORIAS_DATA: Categoria[] = [
  { id_categoria: 1, nombre: "Alimentos", tipo: "GASTO" },
  { id_categoria: 2, nombre: "Transporte", tipo: "GASTO" },
  { id_categoria: 3, nombre: "Vivienda", tipo: "GASTO" },
  { id_categoria: 4, nombre: "Salud", tipo: "GASTO" },
  { id_categoria: 5, nombre: "Educación", tipo: "GASTO" },
  { id_categoria: 6, nombre: "Entretenimiento", tipo: "GASTO" },
  { id_categoria: 7, nombre: "Ropa", tipo: "GASTO" },
  { id_categoria: 8, nombre: "Tecnología", tipo: "GASTO" },
  { id_categoria: 9, nombre: "Viajes", tipo: "GASTO" },
  { id_categoria: 10, nombre: "Otros", tipo: "GASTO" },
  { id_categoria: 11, nombre: "Salario", tipo: "INGRESO" },
  { id_categoria: 12, nombre: "Ventas", tipo: "INGRESO" },
  { id_categoria: 13, nombre: "Regalos", tipo: "INGRESO" },
  { id_categoria: 14, nombre: "Inversiones", tipo: "INGRESO" },
  { id_categoria: 15, nombre: "Otros Ingresos", tipo: "INGRESO" },
];
export class CategoryRepositoryMock implements ICategoryRepository<Categoria> {
  private categoriasDB: Categoria[] = MOCK_CATEGORIAS_DATA;

  async getCategory(tipo: TipoCategoria): Promise<Categoria[]> {
    const categorias = this.categoriasDB.filter((cat) => cat.tipo === tipo);
    return Promise.resolve(categorias);
  }

  async getAllCategories(): Promise<Categoria[]> {
    return Promise.resolve(this.categoriasDB);
  }
}
