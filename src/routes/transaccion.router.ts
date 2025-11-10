import { Router } from "express";
import { TransaccionController } from "../controllers/transaccion.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/user-rol.middleware";
import { transaccionRepository } from "../repositories";
import { TransaccionService } from "../services/transaccion.service";

const router = Router();
const transactionController = new TransaccionController(
  new TransaccionService(transaccionRepository),
);
router.use(authMiddleware);

router.get("/admin/all", isAdmin, transactionController.obtenerTodasLasTransacciones);

router.post("/", transactionController.crearTransaccion);
router.get("/", transactionController.obtenerTransaccionesPorUsuario);
router.get("/resumen", transactionController.obtenerResumen);
router.get("/:id", transactionController.obtenerTransaccionPorId);
router.patch("/:id", transactionController.actualizarTransaccion);
router.delete("/:id", transactionController.eliminarTransaccion);

export default router;
