import { categoryService, transaccionService } from "../../..";
import type { IReportType } from "./IReportType";
import type { CategoriesReportData } from "./types/types";

export class CategoriesReport implements IReportType<CategoriesReportData> {
  async generar(
    id_usuario: number,
  ): Promise<{ data: CategoriesReportData[]; title: string }> {
    const categories = await categoryService.getAllCategories();
    const transactions =
      await transaccionService.obtenerTransaccionesUsuario(id_usuario);

    const categoriesWithTransactions = categories.filter((category) =>
      transactions.some(
        (transac) => transac.id_categoria === category.id_categoria,
      ),
    );

    const data = categoriesWithTransactions.map((category) => {
      const total = transactions
        .filter((transac) => transac.id_categoria === category.id_categoria)
        .reduce((acc, curr) => acc + curr.monto, 0);
      return {
        Categoria: category.nombre,
        Tipo: category.tipo,
        Total: total.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
      };
    });
    return {
      data,
      title: "Reporte de Categorías",
    };
  }
}
