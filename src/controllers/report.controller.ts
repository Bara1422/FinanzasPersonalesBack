    import type { Response } from "express";
    import type { AuthRequest } from "../middlewares/auth.middleware";
    import fs from "fs";
    import type { ReportService } from "../services/report.service";
    import { toReporteDTO } from "../dtos/reporte.dto";


    export class ReportController {
      constructor(private reportService: ReportService) {}

      
      createReport = async (req: AuthRequest, res: Response) => {
        try {
          const {user} = req;
          if ( !user.id_usuario) {
            return res.status(401).json({ message: "Usuario no encontrado" });
          }

          const data = { ...req.body, id_usuario: user.id_usuario };
          const newReport = await this.reportService.createReport(data, user.id_usuario);
          return res.status(201).json(toReporteDTO(newReport));
        } catch (error: any) {
          console.error("createReport error:", error);
          res.status(500).json({
            message: "Error al crear el reporte",
            error: error.message || error,
          });
        }
      };

    
      getAllReports = async (_req: AuthRequest, res: Response) => {
        try {
          const reports = await this.reportService.getAllReports();
          return res.json(reports.map(toReporteDTO));
        } catch (error: any) {
          console.error("getAllReports error:", error);
          res.status(500).json({
            message: "Error al obtener los reportes",
            error: error.message || error,
          });
        }
      };

      
      getUserReports = async (req: AuthRequest, res: Response) => {
        try {
          const {id_usuario} = req.user;
          if (!id_usuario) {
            return res.status(401).json({ message: "Usuario no autenticado" });
          }

          const reports = await this.reportService.getUserReports(id_usuario);
          return res.json(reports.map(toReporteDTO));
        } catch (error: any) {
          console.error("getUserReports error:", error);
          res.status(500).json({
            message: "Error al obtener los reportes del usuario",
            error: error.message || error,
          });
        }
      };

      
      getReportSummary = async (req: AuthRequest, res: Response) => {
        try {
          const {id_usuario} = req.user;
          if (!id_usuario) {
            return res.status(401).json({ message: "Usuario no autenticado" });
          }

          const resumen = await this.reportService.getReportSummary(id_usuario);
          return res.json(resumen);
        } catch (error: any) {
          console.error("getReportSummary error:", error);
          res.status(500).json({
            message: "Error al obtener el resumen del reporte",
            error: error.message || error,
          });
        }
      };

      
      getReportById = async (req: AuthRequest, res: Response) => {
        try {
          const id = Number(req.params.id);
          const {id_usuario} = req.user;
          
          if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID invalido" });
          }

          const reporte = await this.reportService.getReportById(id, id_usuario);
          if (!reporte) {
            return res.status(404).json({ message: "Reporte no encontrado" });
          }

          return res.json(toReporteDTO(reporte));
        } catch (error: any) {
          console.error("getReportById error:", error);
          res.status(500).json({
            message: "Error al obtener el reporte",
            error: error.message || error,
          });
        }
      };

      
      updateReport = async (req: AuthRequest, res: Response) => {
        try {
          const id = Number(req.params.id);
          const {id_usuario} = req.user;
          
          if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID invalido" });
          }

          const data: Partial<{
            titulo: string;
            descripcion: string;
            fecha_generacion: Date;
          }> = req.body;

          const updatedReport = await this.reportService.updateReport(id, data, id_usuario);

          if (!updatedReport) {
            return res.status(404).json({ message: "Reporte no encontrado" });
          }

          return res.json(toReporteDTO(updatedReport));
        } catch (error: any) {
          console.error("updateReport error:", error);
          res.status(500).json({
            message: "Error al actualizar el reporte",
            error: error.message || error,
          });
        }
      };

      
      deleteReport = async (req: AuthRequest, res: Response) => {
        try {
          const id = Number(req.params.id);
          const { id_usuario} = req.user;

          if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID invalido" });
          }

          const message = await this.reportService.deleteReport(id, id_usuario);
          return res.json({ message });
        } catch (error: any) {
          console.error("deleteReport error:", error);
          res.status(500).json({
            message: "Error al eliminar el reporte",
            error: error.message || error,
          });
        }
      };

      
      generateReport = async (req: AuthRequest, res: Response) => {
        try {
          const { type, format } = req.params;
          const {id_usuario} = req.user;

          if (!id_usuario) {
            return res.status(401).json({ message: "Usuario no autenticado" });
          }

          if (!type || !format) {
            return res.status(400).json({ message: "Tipo o formato de reporte no especificado" });
          }

          const report = await this.reportService.generateReport(type, format, id_usuario);

          if (format === "pdf" && typeof report === "string") {
            if (!fs.existsSync(report)) {
              return res.status(404).json({ message: "PDF file not found" });
            }

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${type}.pdf`);

            const fileStream = fs.createReadStream(report);
            fileStream.pipe(res);
            fileStream.on("end", () => fs.unlink(report, () => {}));

            return;
          }

          if (format === "excel") {
            res.setHeader("Content-Disposition", `attachment; filename=${type}.xlsx`);
            return res.send(report);
          }

          res.json(report);
        } catch (error: any) {
          console.error("generateReport:", error);
          res.status(500).json({
            message: "Error al generar el reporte",
            error: error.message || error,
          });
        }
      };
    }
