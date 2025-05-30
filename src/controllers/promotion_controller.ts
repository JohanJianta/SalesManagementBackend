import { getAllPromotions, getPromotionById } from "../services/promotion_service";
import { AuthenticatedRequest } from "../middlewares/auth_middleware";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app_error";

export async function fetchPromotions(req: Request, res: Response, next: NextFunction) {
  try {
    const promotions = await getAllPromotions();
    res.send(promotions);
  } catch (err) {
    next(err);
  }
}

export async function fetchPromotionById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw AppError.BadRequest("id", "ID promotion tidak valid");

    const promotion = await getPromotionById(Number(id));
    if (!promotion) throw AppError.NotFound("id", "Promotion tidak ditemukan");
    res.send(promotion);
  } catch (err) {
    next(err);
  }
}

export function addPromotion(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export function removePromotionById(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
