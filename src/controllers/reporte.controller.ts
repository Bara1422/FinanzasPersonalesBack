import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { FormatoReporte, TipoReporte } from "../schemas/reporte.schema";
import { ReportService } from "../services/reportes/report.service";
import { CustomError } from "../utils/CustomError";

export class ReporteController {
  async generateReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const { type, format } = req.query as {
        type: TipoReporte;
        format: FormatoReporte;
      };

      if (type === "todos_usuarios" && req.user?.rol !== "ADMIN") {
        throw new CustomError(
          "Acceso denegado. Solo administradores pueden generar este reporte.",
          403,
        );
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
      next(error);
    }
  }
}
