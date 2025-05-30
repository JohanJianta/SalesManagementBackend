import { getAllClusterProductUnits, getProductById } from "../services/product_service";
import { getAllPromotions } from "../services/promotion_service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app_error";

export async function fetchProductUnits(req: Request, res: Response, next: NextFunction) {
  try {
    const clusterProductUnits = await getAllClusterProductUnits();
    res.send(clusterProductUnits);
  } catch (err) {
    next(err);
  }
}

export async function fetchProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw AppError.BadRequest("id", "ID product tidak valid");

    const product = await getProductById(Number(id));
    if (!product) throw AppError.NotFound("id", "Product tidak ditemukan");

    const promotions = await getAllPromotions(product.cluster_ref.id);
    product.cluster_ref.promotions = promotions;
    res.send(product);
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
