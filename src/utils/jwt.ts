import { UserResponse } from "../models/dtos/user_dto";
import jwt from "jsonwebtoken";
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET as string;
const jwtExpiresIn = "7d";

export function generateToken(payload: UserResponse): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

export function verifyToken(token: string): UserResponse {
  return jwt.verify(token, jwtSecret) as UserResponse;
}
