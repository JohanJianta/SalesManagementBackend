import { registerUser, loginUser } from "../controllers/auth_controller";
import { Router } from "express";

const router = Router();

/**
 * @openapi
 * paths:
 *   /auth/register:
 *     post:
 *       tags:
 *        - Auth
 *       summary: Register a new user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterInput'
 *       responses:
 *         201:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthResponse'
 *         400:
 *           description: Bad Request
 *         409:
 *           description: Conflict
 *         500:
 *           description: Internal Server Error
 */
router.post("/auth/register", registerUser);

/**
 * @openapi
 * paths:
 *   /auth/login:
 *     post:
 *       tags:
 *        - Auth
 *       summary: Login a user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginInput'
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthResponse'
 *         400:
 *           description: Bad Request
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal Server Error
 */
router.post("/auth/login", loginUser);

export default router;
