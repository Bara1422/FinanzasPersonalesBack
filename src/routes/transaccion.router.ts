import { Router } from "express";
import { TransaccionController } from "../controllers/transaccion.controller";
import { authMiddleware } from "../middlewares/auth.middleware"; 

const router = Router();

router.use(authMiddleware);

router.post("/", TransaccionController.crearTransaccion);
router.get("/", TransaccionController.obtenerTransacciones);
router.get("/resumen", TransaccionController.obtenerResumen);
router.get("/:id", TransaccionController.obtenerTransaccionPorId);
router.put("/:id", TransaccionController.actualizarTransaccion);
router.delete("/:id", TransaccionController.eliminarTransaccion);

export default router;
