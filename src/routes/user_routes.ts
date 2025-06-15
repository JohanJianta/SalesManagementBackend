import { fetchUsers, fetchUserById } from "../controllers/user_controller";
import { Router } from "express";

const router = Router();
router.get("/", fetchUsers);
router.get("/:id", fetchUserById);

export default router;
