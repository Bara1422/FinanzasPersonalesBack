import { Router } from "express";
import { ReporteController } from "../controllers/reporte.controller";

const router = Router();

const reportController = new ReporteController();

router.get("/generar", reportController.generateReport);

export default router;
