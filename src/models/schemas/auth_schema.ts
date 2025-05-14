import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: johndoe@test.com
 *         password:
 *           type: string
 *           example: johndoe
 *         role:
 *           type: string
 *           enum: [admin, sales, manager]
 *           example: sales
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: johndoe@test.com
 *         password:
 *           type: string
 *           example: johndoe
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
 *             email:
 *               type: string
 *               example: johndoe@test.com
 *             role:
 *               type: string
 *               enum: [admin, sales, manager]
 *               example: sales
 */

export const RegisterSchema = z
  .object({
    email: z.string({ required_error: "Email diperlukan" }).trim().email({ message: "Email tidak valid" }),
    password: z
      .string({ required_error: "Password diperlukan" })
      .trim()
      .min(6, { message: "Password minimal 6 karakter" }),
    role: z.enum(["admin", "sales", "manager"], {
      errorMap: () => ({
        message: "Role harus salah satu dari: admin, sales, manager",
      }),
    }),
  })
  .partial({ role: true });

export const LoginSchema = z.object({
  email: z.string({ required_error: "Email diperlukan" }).trim().email({ message: "Email tidak valid" }),
  password: z.string({ required_error: "Password diperlukan" }).trim(),
});
