import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getSecretOrEnv } from "../utils/Enviroments.js";
import '../models/index.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

import healthRoutes from "../routes/healthRoutes.js";
import authRoutes from "../routes/Auth.routes.js";
import escolaRoutes from "../routes/Escola.routes.js";
import turmaRoutes from "../routes/Turma.routes.js";
import alunoRoutes from "../routes/Aluno.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

const frontend = getSecretOrEnv("FRONTEND_URL");
app.use(
    cors({
        origin: frontend,
        credentials: true,
    })
);

app.use("/api", healthRoutes);
app.use("/auth", authRoutes);
app.use("/escola", escolaRoutes);
app.use("/turma", turmaRoutes);
app.use("/aluno", alunoRoutes);

export default app;
