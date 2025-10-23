import { Router } from "express";
import cookieParser from "cookie-parser";
import { login, logout, validateToken } from "../controllers/AuthController.js";

const router = Router();
router.use(cookieParser());

router.post("/login", login);
router.post("/login", login);
router.post("/logout", logout);
router.get("/validate", validateToken);

export default router;
