import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { ReportService } from "../services/report.service";

const router = Router();


const repositoryFactory = RepositoryFactory.getInstance();
const reportRepository = repositoryFactory.getReportRepository();
const transaccionRepository = repositoryFactory.getTransaccionRepository();


const reportService = new ReportService(reportRepository, transaccionRepository);
const reportController = new ReportController(reportService);


router.get("/usuario/actual", reportController.getUserReports);
router.get("/resumen/actual", reportController.getReportSummary);
router.get("/generar/:type/:format", reportController.generateReport);

router.post("/", reportController.createReport);
router.get("/", reportController.getAllReports);
router.get("/:id", reportController.getReportById);
router.put("/:id", reportController.updateReport);
router.delete("/:id", reportController.deleteReport);

export default router;
