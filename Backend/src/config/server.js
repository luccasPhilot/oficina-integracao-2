import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getSecretOrEnv } from "../utils/Enviroments.js";

import healthRoutes from "../routes/healthRoutes.js";
import authRoutes from "../routes/Auth.routes.js";
import escolaRoutes from "../routes/Escola.routes.js";

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

export default app;
