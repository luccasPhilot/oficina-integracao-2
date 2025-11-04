import { Router } from "express";
import { createTurma, deleteTurma, getAllTurmas, getTurmaById, updateTurma } from '../controllers/TurmaController.js';

const router = Router();

router.post("/", createTurma);
router.get("/", getAllTurmas);
router.get("/:id", getTurmaById);
router.put("/:id", updateTurma);
router.delete("/:id", deleteTurma);

export default router;
