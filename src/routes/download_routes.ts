import { fetchLatest } from "../controllers/download_controller";
import { Router } from "express";

const router = Router();
router.get("/latest", fetchLatest);

export default router;
