import { addProduct, fetchProductById, fetchProductUnits, removeProductById } from "../controllers/product_controller";
import { authenticateUserRole } from "../middlewares/auth_middleware";
import { fileUpload } from "../middlewares/multer_middleware";
import { Router } from "express";

const router = Router();

/**
 * @openapi
 * paths:
 *   /products:
 *     get:
 *       tags:
 *         - Products
 *       summary: Get all available product units (grouped by cluster and product)
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ClusterProductUnit'
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal Server Error
 */
router.get("/", fetchProductUnits);

/**
 * @openapi
 * paths:
 *   /products/{id}:
 *     get:
 *       tags:
 *         - Products
 *       summary: Get product detail by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             example: 1
 *           description: ID of the product
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ProductResponse'
 *         400:
 *           description: Bad Request
 *         401:
 *           description: Unauthorized
 *         404:
 *           description: Not Found
 *         500:
 *           description: Internal Server Error
 */
router.get("/:id", fetchProductById);

router.post("/", authenticateUserRole, fileUpload, addProduct);
router.delete("/:id", authenticateUserRole, removeProductById);

export default router;
