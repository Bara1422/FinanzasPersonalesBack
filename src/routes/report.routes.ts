import { Router } from "express";
import { ReporteController } from "../controllers/reporte.controller";
import { validate } from "../middlewares/validate-schema.middleware";
import { reporteQuerySchema } from "../schemas/reporte.schema";

const router = Router();

const reportController = new ReporteController();

router.get(
  "/generar",
  validate(reporteQuerySchema, "query"),
  reportController.generateReport,
);

export default router;
