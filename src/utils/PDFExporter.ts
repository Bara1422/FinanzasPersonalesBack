import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import type { ReportData } from "../services/reportes/strategies/typeReport/types/types";

pdfMake.vfs = pdfFonts.vfs;

const formatValue = (value): string => {
  if (value instanceof Date) {
    return value.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  return value?.toString() || "";
};

export const pdfGenerator = async (
  data: ReportData[],
  title: string,
): Promise<Buffer> => {
  return new Promise((resolve) => {
    if (data.length === 0) {
      const docDefinition: TDocumentDefinitions = {
        pageMargins: [30, 60, 30, 60],
        header: {
          text: title || "Reporte",
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 20, 0, 0],
        },
        content: [
          {
            text: "No hay datos para mostrar.",
            fontSize: 12,
            alignment: "center",
            margin: [0, 20, 0, 0],
          },
        ],
      };

      pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
        resolve(Buffer.from(buffer));
      });
      return;
    }

    const columnas = Object.keys(data[0]);
    const content: any[] = [];

    // Generar formato vertical para cada registro
    data.forEach((row, index) => {
      content.push(
        {
          text: `Registro #${index + 1}`,
          fontSize: 14,
          bold: true,
          color: "#2c3e50",
          margin: [0, index === 0 ? 0 : 15, 0, 8],
        },
        {
          table: {
            widths: [150, "*"],
            body: columnas.map((col, colIndex) => [
              {
                text: col.toUpperCase(),
                bold: true,
                fontSize: 10,
                color: "#34495e",
                fillColor: colIndex % 2 === 0 ? "#ecf0f1" : "#ffffff",
              },
              {
                text: formatValue(row[col]),
                fontSize: 9,
                color: "#2c3e50",
                fillColor: colIndex % 2 === 0 ? "#ecf0f1" : "#ffffff",
              },
            ]),
          },
          layout: {
            hLineWidth: (i, node) =>
              i === 0 || i === node.table.body.length ? 1 : 0.5,
            vLineWidth: () => 1,
            hLineColor: () => "#bdc3c7",
            vLineColor: () => "#bdc3c7",
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 10,
              x2: 515,
              y2: 10,
              lineWidth: 2,
              lineColor: "#3498db",
            },
          ],
          margin: [0, 10, 0, 0],
        },
      );
    });

    const docDefinition: TDocumentDefinitions = {
      pageMargins: [30, 60, 30, 60],

      header: {
        text: title || "Reporte",
        fontSize: 18,
        bold: true,
        color: "#2c3e50",
        alignment: "center",
        margin: [0, 20, 0, 0],
      },

      footer: (currentPage, pageCount) => ({
        columns: [
          {
            text: `Total de registros: ${data.length}`,
            alignment: "left",
            fontSize: 8,
            color: "#7f8c8d",
            margin: [30, 0, 0, 0],
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: "center",
            fontSize: 8,
            color: "#7f8c8d",
          },
          {
            text: `${new Date().toLocaleDateString("es-ES")}`,
            alignment: "right",
            fontSize: 8,
            color: "#7f8c8d",
            margin: [0, 0, 30, 0],
          },
        ],
      }),

      content: content,
    };

    pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
      resolve(Buffer.from(buffer));
    });
  });
};
