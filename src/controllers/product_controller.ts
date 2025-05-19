import { AuthenticatedRequest } from "../middlewares/auth_middleware";
import { getProductById } from "../services/product_service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app_error";

export async function fetchProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw AppError.BadRequest("id", "ID product tidak valid");

    const cluster = await getProductById(Number(id));
    if (!cluster) throw AppError.NotFound("id", "Product tidak ditemukan");
    res.send(cluster);
  } catch (err) {
    next(err);
  }
}

export async function addProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user || user.role == "sales") throw AppError.Forbidden("authentication", "Akses terhadap endpoint dilarang");

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function removeProductById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user || user.role == "sales") throw AppError.Forbidden("authentication", "Akses terhadap endpoint dilarang");

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
