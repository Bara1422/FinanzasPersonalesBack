import { categoryService, transaccionService } from "../../..";
import type { IReportType } from "./IReportType";
import type { TransactionsReportData } from "./types/types";

export class TransactionsReport implements IReportType<TransactionsReportData> {
  async generar(
    id_usuario: number,
  ): Promise<{ data: TransactionsReportData[]; title: string }> {
    const transactions =
      await transaccionService.obtenerTransaccionesUsuario(id_usuario);
    const categories = await categoryService.getAllCategories();

    const data = transactions.map((transaction) => {
      const category = categories.find(
        (cat) => cat.id_categoria === transaction.id_categoria,
      );
      return {
        Fecha: transaction.fecha,
        Monto: transaction.monto,
        Categoria: category.nombre,
        Tipo: category.tipo,
        Descripción: transaction.descripcion,
      };
    });
    return {
      data,
      title: "Reporte de Transacciones",
    };
  }
}
