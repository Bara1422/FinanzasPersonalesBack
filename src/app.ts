import "dotenv/config";
import express from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import transaccionRoutes from "./routes/transaccion.router";
import userRoutes from "./routes/usuario.router";

const app = express();

app.use(express.json());

/* sin auth */
app.use("/auth", authRoutes);
app.use("/categorias", categoryRoutes);

/* con auth */
app.use(authMiddleware);
app.use("/usuarios", userRoutes);
app.use("/transacciones", transaccionRoutes);

export default app;
