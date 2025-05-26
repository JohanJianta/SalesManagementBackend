import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
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
 *     LoginRequest:
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
 */

export const RegisterSchema = z.object({
  name: z.string({ required_error: "Name diperlukan", invalid_type_error: "Name harus berupa string" }).trim(),
  email: z
    .string({ required_error: "Email diperlukan", invalid_type_error: "Email harus berupa string" })
    .trim()
    .email({ message: "Email tidak valid" }),
  password: z
    .string({ required_error: "Password diperlukan", invalid_type_error: "Password harus berupa string" })
    .trim()
    .min(6, { message: "Password minimal 6 karakter" }),
  role: z
    .enum(["admin", "sales", "manager"], {
      errorMap: () => ({
        message: "Role harus salah satu dari: admin, sales, manager",
      }),
    })
    .default("sales"),
});

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email diperlukan", invalid_type_error: "Email harus berupa string" })
    .trim()
    .email({ message: "Email tidak valid" }),
  password: z
    .string({ required_error: "Password diperlukan", invalid_type_error: "Password harus berupa string" })
    .trim(),
});
