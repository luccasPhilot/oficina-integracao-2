import { Router } from "express";
import cookieParser from "cookie-parser";
import { createEscola, getAllEscolas, getEscolaById, updateEscola, deleteEscola } from '../controllers/EscolaController.js';

const router = Router();

router.post("/", createEscola);
router.get("/", getAllEscolas);
router.get("/:id", getEscolaById);
router.put("/:id", updateEscola);
router.delete("/:id", deleteEscola);

export default router;
