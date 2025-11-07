import "dotenv/config";
import cors from "cors";
import express from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import notificacionRoutes from "./routes/notificacion.router";
import transaccionRoutes from "./routes/transaccion.router";
import userRoutes from "./routes/usuario.router";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(express.json());
app.use(cors(corsOptions));

/* sin auth */
app.use("/auth", authRoutes);
app.use("/categorias", categoryRoutes);

/* con auth */
app.use(authMiddleware);
app.use("/usuarios", userRoutes);
app.use("/transacciones", transaccionRoutes);
app.use("/notificaciones", notificacionRoutes);

export default app;
