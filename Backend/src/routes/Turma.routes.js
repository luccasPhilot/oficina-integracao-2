import { Router } from "express";
import cookieParser from "cookie-parser";
import { createTurma, getAllTurmas, getTurmaById, updateTurma, deleteTurma } from '../controllers/TurmaController.js';

const router = Router();

router.post("/", createTurma);
router.get("/", getAllTurmas);
router.get("/:id", getTurmaById);
router.put("/:id", updateTurma);
router.delete("/:id", deleteTurma);

export default router;
