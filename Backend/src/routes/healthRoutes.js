import { Router } from "express";
import { isAlive } from "../controllers/healthController.js";

const router = Router();

router.get("/isAlive", isAlive);

export default router;
