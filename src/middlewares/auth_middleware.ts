import { AuthenticatedRequest } from "../shared/custom_interfaces";
import { Response, NextFunction } from "express";
import { AppError } from "../shared/app_error";
import { verifyToken } from "../utils/jwt";

export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      AppError.Unauthorized("authentication", "Token tidak ditemukan")
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return next(AppError.Unauthorized("authentication", "Token tidak valid"));
  }
}
