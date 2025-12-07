import { Router } from "express";
import { createEscola, deleteEscola, getAllEscolas, getAllTurmasByEscolaId, getEscolaById, updateEscola, createCartaConvite, createCartaConvenio } from '../controllers/EscolaController.js';

const router = Router();

router.post("/", createEscola);
router.get("/", getAllEscolas);
router.get("/:id", getEscolaById);
router.put("/:id", updateEscola);
router.delete("/:id", deleteEscola);

router.get("/:id/turmas", getAllTurmasByEscolaId); 

router.get('/:id/carta-convite', createCartaConvite);
router.get('/:id/carta-convenio', createCartaConvenio);

export default router;
