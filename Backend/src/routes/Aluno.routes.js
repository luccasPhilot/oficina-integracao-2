import { Router } from "express";
import cookieParser from "cookie-parser";
import { createAluno, getAllAlunos, getAlunoById, updateAluno, deleteAluno } from '../controllers/AlunoController.js';

const router = Router();

router.post("/", createAluno);
router.get("/", getAllAlunos);
router.get("/:id", getAlunoById);
router.put("/:id", updateAluno);
router.delete("/:id", deleteAluno);

export default router;
