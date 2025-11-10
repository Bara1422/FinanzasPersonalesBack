// biome-ignore assist/source/organizeImports: <explanation>
import "dotenv/config";
import express from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import transaccionRoutes from "./routes/transaccion.router";
import userController from "./routes/usuario.router";
import reportRoutes from "./routes/report.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.use(authMiddleware);
app.use("/usuarios", userController);
app.use("/transaccion", transaccionRoutes);
app.use("/api/reportes", reportRoutes);

export default app;
