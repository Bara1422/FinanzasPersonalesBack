import { Router } from "express";
import { TransaccionController } from "../controllers/transaccion.controller";
import { isAdmin } from "../middlewares/user-rol.middleware";
import { validate } from "../middlewares/validate-schema.middleware";
import {
  createTransaccionSchema,
  updateTransaccionSchema,
} from "../schemas/transaccion.schema";
import { transaccionService } from "../services";

const router = Router();
const transactionController = new TransaccionController(transaccionService);

router.get(
  "/admin/all",
  isAdmin,
  transactionController.obtenerTodasLasTransacciones,
);

router.post(
  "/",
  validate(createTransaccionSchema),
  transactionController.crearTransaccion,
);
router.get("/", transactionController.obtenerTransaccionesPorUsuario);
router.get("/resumen", transactionController.obtenerResumen);
router.get("/:id", transactionController.obtenerTransaccionPorId);
router.patch(
  "/:id",
  validate(updateTransaccionSchema),
  transactionController.actualizarTransaccion,
);
router.delete("/:id", transactionController.eliminarTransaccion);

export default router;
