import { fetchUsers, fetchUserById } from "../controllers/user_controller";
import { Router } from "express";

const router = Router();
router.get("/users", fetchUsers);
router.get("/users/:id", fetchUserById);

export default router;
