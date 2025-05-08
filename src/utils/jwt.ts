import { FilteredUser } from "../models/dtos/user_dto";
import jwt from "jsonwebtoken";
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET as string;
const jwtExpiresIn = "7d";

export function generateToken(payload: FilteredUser): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

export function verifyToken(token: string): FilteredUser {
  return jwt.verify(token, jwtSecret) as FilteredUser;
}
