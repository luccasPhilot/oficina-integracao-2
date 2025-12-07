import { Router } from "express";
import { createRepresentante, deleteRepresentante, getAllRepresentantes, getRepresentanteById, updateRepresentante } from '../controllers/RepresentanteController.js';

const router = Router();

router.post("/", createRepresentante);
router.get("/", getAllRepresentantes);
router.get("/:id", getRepresentanteById);
router.put("/:id", updateRepresentante);
router.delete("/:id", deleteRepresentante);

export default router;
