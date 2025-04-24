import { hashPassword, comparePasswords } from "../utils/password";
import { FilteredUser } from "../models/dtos/user_dto";
import { users_role } from "@prisma/client";
import db from "../configs/database";

export async function getAllUsers(): Promise<FilteredUser[]> {
  const rows = await db.users.findMany({
    select: { id: true, email: true, role: true },
  });
  return rows;
}

export async function getUserById(id: number): Promise<FilteredUser | null> {
  const row = await db.users.findUnique({
    where: { id },
    select: { id: true, email: true, role: true },
  });
  return row;
}

export async function getUserByEmail(
  email: string,
  password?: string
): Promise<FilteredUser | null> {
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

export async function createUser(
  email: string,
  password: string,
  role: users_role | undefined
): Promise<FilteredUser> {
  const hashedPassword = await hashPassword(password);
  const result = await db.users.create({
    data: { email, password: hashedPassword, role },
    select: { id: true, email: true, role: true },
  });
  return result;
}
