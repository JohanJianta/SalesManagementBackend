import { Request, Response, NextFunction } from "express";
import { UserResponse } from "../models/dtos/user_dto";
import { AppError } from "../utils/app_error";
import { verifyToken } from "../utils/jwt";

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw AppError.Unauthorized("authentication", "Token tidak ditemukan");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    throw AppError.Unauthorized("authentication", "Token tidak valid");
  }
}

export interface AuthenticatedRequest extends Request {
  user?: UserResponse;
}
