import { RegisterSchema, LoginSchema } from "../models/schemas/auth_schema";
import { createUser, getUserByEmail } from "../services/user_service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/app_error";
import { generateToken } from "../utils/jwt";

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      next(new AppError(400, errors));
      return;
    }

    const { email, password, role } = parsed.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      next(AppError.Conflict("email", "Email sudah terdaftar"));
      return;
    }

    const newUser = await createUser(email, password, role);

    const token = generateToken(newUser);
    res.status(201).send({ token, payload: newUser });
  } catch (err) {
    next(err);
  }
}

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      next(new AppError(400, errors));
      return;
    }

    const { email, password } = parsed.data;

    const user = await getUserByEmail(email, password);
    if (!user) {
      next(AppError.Unauthorized("email & password", "User tidak valid"));
      return;
    }

    const token = generateToken(user);
    res.status(200).send({ token, payload: user });
  } catch (err) {
    next(err);
  }
}
