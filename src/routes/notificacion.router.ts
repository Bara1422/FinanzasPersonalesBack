import { Router } from "express";
import { NotificacionController } from "../controllers/notificacion.controller";
import { isAdmin } from "../middlewares/user-rol.middleware";
import { notificacionService } from "../services";

const router = Router();
const notificacionController = new NotificacionController(notificacionService);

router.get(
  "/admin/all",
  isAdmin,
  notificacionController.obtenerTodasLasNotificaciones,
);

router.post("/", notificacionController.crearNotificacion);
router.get("/", notificacionController.obtenerNotificacionesPorUsuario);
router.get(
  "/pending",
  notificacionController.obtenerNotificacionesPendientesPorUsuario,
);
router.get("/:id", notificacionController.obtenerNotificacionPorId);
router.patch("/:id", notificacionController.actualizarNotificacion);
router.delete("/:id", notificacionController.eliminarNotificacion);
router.post("/:id/pagar", notificacionController.marcarNotificacionComoPagada);

export default router;
