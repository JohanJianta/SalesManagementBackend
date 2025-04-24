import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string({ required_error: "Email diperlukan" })
      .trim()
      .email({ message: "Email tidak valid" }),
    password: z
      .string({ required_error: "Password diperlukan" })
      .trim()
      .min(6, { message: "Password minimal 6 karakter" }),
    role: z.enum(["admin", "sales", "manager"], {
      errorMap: () => ({
        message: "Role harus salah satu dari: admin, sales, atau manager",
      }),
    }),
  })
  .partial({ role: true });

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email diperlukan" })
    .trim()
    .email({ message: "Email tidak valid" }),
  password: z.string({ required_error: "Password diperlukan" }).trim(),
});
