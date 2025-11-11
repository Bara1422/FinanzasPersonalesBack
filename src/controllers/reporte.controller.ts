import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import { ReportService } from "../services/reportes/report.service";

export class ReporteController {
  async generateReport(req: AuthRequest, res: Response) {
    try {
      const type = req.query.type as string;
      const format = req.query.format as "pdf" | "excel";

      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const buffer = await ReportService.generateReport(
        type,
        format,
        id_usuario,
      );
      const normalizedFormat = format === "excel" ? "xlsx" : format;
      const nombreArchivo = `reporte_${type}-${new Date().toISOString().split("T")[0]}.${normalizedFormat}`;
      const contentType =
        format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`,
      );
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
      return res.send(buffer);
    } catch (error) {
      return res.status(500).json({
        message: "Error al generar el reporte",
        error: error.message || error,
      });
    }
  }
}
