import { hashPassword, comparePasswords } from "../utils/password";
import { UserResponse } from "../models/dtos/user_dto";
import { user_role } from "@prisma/client";
import db from "../configs/database";

export function getAllUsers(): Promise<UserResponse[]> {
  const rows = db.users.findMany({
    select: { id: true, email: true, role: true },
  });
  return rows;
}

export function getUserById(id: number): Promise<UserResponse | null> {
  const row = db.users.findUnique({
    where: { id },
    select: { id: true, email: true, role: true },
  });
  return row;
}

export async function getUserByEmail(email: string, password?: string): Promise<UserResponse | null> {
  const row = await db.users.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, role: true },
  });

  if (row && (!password || (await comparePasswords(password, row.password)))) {
    const { password: _, ...filteredRow } = row;
    return filteredRow;
  }

  return null;
}

export async function createUser(email: string, password: string, role: user_role | undefined): Promise<UserResponse> {
  const hashedPassword = await hashPassword(password);
  const result = db.users.create({
    data: { email, password: hashedPassword, role },
    select: { id: true, email: true, role: true },
  });
  return result;
}
