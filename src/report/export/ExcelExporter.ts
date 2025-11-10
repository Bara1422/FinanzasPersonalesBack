import ExcelJS from "exceljs";

export class ExcelExporter {
  async exportar(data: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet("Reporte");

    if (data && data.length > 0) {
      // Definir las columnas usando las claves del primer objeto
      const columnas = Object.keys(data[0]).map((col) => ({
        header: col,
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
  }
}
