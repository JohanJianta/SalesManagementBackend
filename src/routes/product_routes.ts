import { addProduct, fetchProductById, removeProductById } from "../controllers/product_controller";
import { authenticateUserRole } from "../middlewares/auth_middleware";
import { fileUpload } from "../middlewares/multer_middleware";
import { Router } from "express";

const router = Router();

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
router.get("/products/:id", fetchProductById);

router.post("/products", authenticateUserRole, fileUpload, addProduct);
router.delete("/products/:id", authenticateUserRole, removeProductById);

export default router;
