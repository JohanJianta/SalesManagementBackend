import { registerUser, loginUser } from "../controllers/auth_controller";
import { Router } from "express";

const router = Router();
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

export default router;
