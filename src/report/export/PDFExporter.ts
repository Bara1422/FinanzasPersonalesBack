import PDFDocument from "pdfkit";
import fs from "fs";

export class PDFExporter {
  async exportar(data: any[]): Promise<string> {
    const filePath = "./reporte.pdf";
    const doc = new PDFDocument({ margin: 30 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text("Reporte", { align: "center" });
    doc.moveDown();

    if (data && data.length > 0) {
      for (const fila of data) {
        for (const clave in fila) {
          doc.fontSize(12).text(`${clave}: ${fila[clave]}`);
        }
        doc.moveDown();
      }
    } else {
      doc.fontSize(12).text("No hay datos para mostrar.");
    }

    doc.end();

    return new Promise((resolve) => {
      stream.on("finish", () => resolve(filePath));
    });
  }
}
