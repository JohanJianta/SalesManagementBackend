import { RegisterSchema, LoginSchema } from "../models/schemas/auth_schema";
import { RegisterRequest, LoginRequest } from "../models/dtos/user_dto";
import { createUser, getUserByEmail } from "../services/user_service";
import { validateRequestBody } from "../utils/request_util";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app_error";
import { generateToken } from "../utils/jwt";

export async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = validateRequestBody<RegisterRequest>(req.body, RegisterSchema);
    const { email, role } = validatedData;

    if (role != "sales") throw AppError.Forbidden("role", `Anda tidak memiliki akses untuk membuat user ${role}`);

    const existingUser = await getUserByEmail(email);
    if (existingUser) throw AppError.Conflict("email", "Email sudah terdaftar");

    const newUser = await createUser(validatedData);
    const token = generateToken(newUser);
    res.status(201).send({ token, payload: newUser });
  } catch (err) {
    next(err);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = validateRequestBody<LoginRequest>(req.body, LoginSchema);
    const { email, password } = validatedData;

    const user = await getUserByEmail(email, password);
    if (!user) throw AppError.Unauthorized("authentication", "User tidak valid");

    const token = generateToken(user);
    res.send({ token, payload: user });
  } catch (err) {
    next(err);
  }
}
