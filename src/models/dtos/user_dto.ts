import { user_role } from "@prisma/client";

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikp...
 *         payload:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: John Doe
 *             email:
 *               type: string
 *               example: johndoe@test.com
 *             role:
 *               type: string
 *               enum: [admin, sales, manager]
 *               example: sales
 */

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: user_role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: user_role;
}
