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
 *           default: janedoe@test.com
 *         password:
 *           type: string
 *           default: janedoe
 *         role:
 *           type: enum[admin, sales, manager]
 *           default: sales
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           default: janedoe@test.com
 *         password:
 *           type: string
 *           default: janedoe
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         payload:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             email:
 *               type: string
 *             role:
 *               type: string
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
