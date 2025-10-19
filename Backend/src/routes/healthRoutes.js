import { Router } from "express";
import { isAlive } from "../controllers/healthController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/isAlive", isAlive);

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'ELLP API' });
});

export default router;
