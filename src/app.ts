import cors from "cors";
import express from "express";
import { ENV } from "./config/env";
import { authMiddleware } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/custom-error.middleware";
import { apiLimiter } from "./middlewares/rate-limit.middleware";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import notificacionRoutes from "./routes/notificacion.routes";
import reportRoutes from "./routes/report.routes";
import transaccionRoutes from "./routes/transaccion.routes";
import userRoutes from "./routes/usuario.routes";

const app = express();

const corsOptions = {
  origin: ENV.CORS_ORIGIN.split(","),
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(apiLimiter);

/* sin auth */
app.use("/auth", authRoutes);
app.use("/categorias", categoryRoutes);

/* con auth */
app.use(authMiddleware);
app.use("/usuarios", userRoutes);
app.use("/transacciones", transaccionRoutes);
app.use("/notificaciones", notificacionRoutes);
app.use("/reportes", reportRoutes);

app.use(errorHandler);

export default app;
