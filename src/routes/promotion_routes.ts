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

/**
 * @openapi
 * paths:
 *   /promotions:
 *     get:
 *       tags:
 *         - Promotions
 *       summary: Get all promotions
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BriefPromotion'
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal Server Error
 */
router.get("/", fetchPromotions);

/**
 * @openapi
 * paths:
 *   /promotions/{id}:
 *     get:
 *       tags:
 *         - Promotions
 *       summary: Get promotion detail by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             example: 1
 *           description: ID of the promotion
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PromotionDetail'
 *         400:
 *           description: Bad Request
 *         401:
 *           description: Unauthorized
 *         404:
 *           description: Not Found
 *         500:
 *           description: Internal Server Error
 */
router.get("/:id", fetchPromotionById);

router.post("/", authenticateUserRole, fileUpload, addPromotion);
router.delete("/:id", authenticateUserRole, removePromotionById);

export default router;
