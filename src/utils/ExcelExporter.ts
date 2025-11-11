import ExcelJS from "exceljs";
import type { ReportData } from "../services/reportes/strategies/typeReport/types/types";

export const excelGenerator = async (
  data: ReportData[],
  title: string,
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const hoja = workbook.addWorksheet(title || "Reporte");

  if (data.length === 0) {
    hoja.addRow(["No hay datos para mostrar."]);
  } else {
    // Definir las columnas usando las claves del primer objeto
    const columnas = Object.keys(data[0]).map((col) => ({
      header: col.toUpperCase(),
      key: col,
      width: 20,
    }));

    hoja.columns = columnas;

    // Agregar filas
    for (let i = 0; i < data.length; i++) {
      hoja.addRow(data[i]);
    }
  }
  // ExcelJS devuelve un Uint8Array, lo convertimos a Buffer
  const resultado = await workbook.xlsx.writeBuffer();
  return Buffer.from(resultado);
};
