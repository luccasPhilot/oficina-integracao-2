import { Router } from "express";
import { createAluno, deleteAluno, getAllAlunos, getAlunoById, updateAluno } from '../controllers/AlunoController.js';

const router = Router();

router.post("/", createAluno);
router.get("/", getAllAlunos);
router.get("/:id", getAlunoById);
router.put("/:id", updateAluno);
router.delete("/:id", deleteAluno);

export default router;
