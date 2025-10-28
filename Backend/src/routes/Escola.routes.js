import { Router } from "express";
import cookieParser from "cookie-parser";
import { createEscola, getAllEscolas, getEscolaById, updateEscola, deleteEscola, getAllTurmasByEscolaId } from '../controllers/EscolaController.js';

const router = Router();

router.post("/", createEscola);
router.get("/", getAllEscolas);
router.get("/:id", getEscolaById);
router.put("/:id", updateEscola);
router.delete("/:id", deleteEscola);

router.get("/:id/turmas", getAllTurmasByEscolaId); 

export default router;
