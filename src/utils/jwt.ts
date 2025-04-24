import { FilteredUser } from "../models/dtos/user_dto";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "YOU-R-MY-SUNSHINE";
const JWT_EXPIRES_IN = "7d";

export function generateToken(payload: FilteredUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): FilteredUser {
  return jwt.verify(token, JWT_SECRET) as FilteredUser;
}
