import { authenticateUserRole } from "../middlewares/auth_middleware";
import { fileUpload } from "../middlewares/multer_middleware";
import { Router } from "express";
import {
  fetchPromotions,
  fetchPromotionById,
  addPromotion,
  removePromotionById,
} from "../controllers/promotion_controller";

const router = Router();

router.get("/promotions", fetchPromotions);
router.get("/promotions/:id", fetchPromotionById);
router.post("/promotions", authenticateUserRole, fileUpload, addPromotion);
router.delete("/promotions/:id", authenticateUserRole, removePromotionById);

export default router;
