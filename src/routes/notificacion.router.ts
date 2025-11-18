import { Router } from "express";
import { NotificacionController } from "../controllers/notificacion.controller";
import { isAdmin } from "../middlewares/user-rol.middleware";
import { validate } from "../middlewares/validate-schema.middleware";
import {
  createNotificacionSchema,
  updateNotificacionSchema,
} from "../schemas/notificacion.schema";
import { notificacionService } from "../services";

const router = Router();
const notificacionController = new NotificacionController(notificacionService);

router.get(
  "/admin/all",
  isAdmin,
  notificacionController.obtenerTodasLasNotificaciones,
);

router.post(
  "/",
  validate(createNotificacionSchema),
  notificacionController.crearNotificacion,
);
router.get("/", notificacionController.obtenerNotificacionesPorUsuario);
router.get(
  "/pending",
  notificacionController.obtenerNotificacionesPendientesPorUsuario,
);
router.get(
  "/paid",
  notificacionController.obtenerNotificacionesPagadasPorUsuario,
);
router.get("/:id", notificacionController.obtenerNotificacionPorId);
router.patch(
  "/:id",
  validate(updateNotificacionSchema),
  notificacionController.actualizarNotificacion,
);
router.delete("/:id", notificacionController.eliminarNotificacion);
router.post("/:id/pagar", notificacionController.marcarNotificacionComoPagada);

export default router;
