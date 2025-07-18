import { RegisterRequest, UserResponse } from "../models/dtos/user_dto";
import { hashPassword, comparePasswords } from "../utils/password";
import db from "../configs/database";

export function getAllUsers(): Promise<UserResponse[]> {
  const rows = db.users.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  return rows;
}

export function getUserById(id: number): Promise<UserResponse | null> {
  const row = db.users.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });
  return row;
}

export async function getUserByEmail(email: string, password?: string): Promise<UserResponse | null> {
  const row = await db.users.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true, role: true },
  });
  if (!row) return null;

  const isPasswordValid = password !== undefined ? await comparePasswords(password, row.password) : true;
  if (!isPasswordValid) return null;

  const { password: _, ...filteredRow } = row;
  return filteredRow;
}

export async function createUser(registerData: RegisterRequest): Promise<UserResponse> {
  const { password, ...rest } = registerData;
  const hashedPassword = await hashPassword(password);
  const result = db.users.create({
    data: { ...rest, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true },
  });
  return result;
}
