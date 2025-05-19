import { BriefPromotion, PromotionDetail } from "../models/dtos/promotion_dto";
import { getFileFromS3 } from "../utils/s3_command";
import db from "../configs/database";

export async function getAllPromotions(): Promise<BriefPromotion[]> {
  const rows = await db.promotions.findMany({
    where: {
      OR: [{ expired_at: null }, { expired_at: { gt: new Date() } }],
    },
    select: {
      id: true,
      title: true,
      thumbnail_url: true,
      created_at: true,
    },
  });

  rows.forEach((row) => (row.thumbnail_url = getFileFromS3(row.thumbnail_url)));
  return rows;
}

export async function getPromotionById(id: number): Promise<PromotionDetail | null> {
  const row = await db.promotions.findUnique({
    where: {
      id,
      OR: [{ expired_at: null }, { expired_at: { gt: new Date() } }],
    },
    omit: { id: true, user_id: true },
  });

  if (!row) return null;
  row.thumbnail_url = getFileFromS3(row.thumbnail_url);
  return row;
}

export function createPromotion() {}

export function deletePromotionById() {}
