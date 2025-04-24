import { getAllUsers, getUserById } from "../services/user_service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/app_error";

export async function fetchUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    next(err);
  }
}

export async function fetchUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      next(AppError.BadRequest("id", "ID pengguna tidak valid"));
      return;
    }

    const user = await getUserById(id);
    if (!user) {
      next(AppError.NotFound("id", "User tidak ditemukan"));
      return;
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
}
