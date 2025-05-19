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

export async function addProduct(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function removeProductById(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
