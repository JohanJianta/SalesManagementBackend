import { RegisterSchema, LoginSchema } from "../models/schemas/auth_schema";
import { createUser, getUserByEmail } from "../services/user_service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app_error";
import { generateToken } from "../utils/jwt";
import { validateRequestBody } from "../utils/request_util";
import { UserRequest } from "../models/dtos/user_dto";

export async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = validateRequestBody<UserRequest>(req.body, RegisterSchema);
    const { email, password, role } = validatedData;

    const existingUser = await getUserByEmail(email);
    if (existingUser) throw AppError.Conflict("email", "Email sudah terdaftar");

    const newUser = await createUser(email, password, role);
    const token = generateToken(newUser);
    res.status(201).send({ token, payload: newUser });
  } catch (err) {
    next(err);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = validateRequestBody<UserRequest>(req.body, LoginSchema);
    const { email, password } = validatedData;

    const user = await getUserByEmail(email, password);
    if (!user) throw AppError.Unauthorized("email & password", "User tidak valid");

    const token = generateToken(user);
    res.send({ token, payload: user });
  } catch (err) {
    next(err);
  }
}
