import { getAllUsers, getUserById } from "../services/user_service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app_error";

export async function fetchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    next(err);
  }
}

export async function fetchUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw AppError.BadRequest("id", "ID pengguna tidak valid");

    const user = await getUserById(id);
    if (!user) throw AppError.NotFound("id", "User tidak ditemukan");
    res.send(user);
  } catch (err) {
    next(err);
  }
}
