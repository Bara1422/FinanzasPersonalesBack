import "dotenv/config";
import express from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import userController from "./routes/usuario.router";

const app = express();

const PORT = 3000;
app.use(express.json());

app.use("/auth", authRoutes);

app.use(authMiddleware);
app.use("/usuarios", userController);

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
