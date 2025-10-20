import express from 'express';
import authRoutes from "./routes/auth.routes";

const app = express()

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})

app.use("/api/auth", authRoutes);
app.use(express.json());
