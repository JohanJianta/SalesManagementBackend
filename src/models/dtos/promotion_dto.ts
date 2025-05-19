/**
 * @openapi
 * components:
 *   schemas:
 *     BriefPromotion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Promotion Example
 *         thumbnail_url:
 *           type: string
 *           example: https://example.com/thumbnail/promotion-1.jpg
 *         created_at:
 *           type: Date
 *           example: 2025-05-19T17:09:50.000Z
 *     PromotionDetail:
 *       type: object
 *       properties:
 *         cluster_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         title:
 *           type: string
 *           example: Diskon Khusus Cluster Treasure Island
 *         content:
 *           type: string
 *           example: Dapatkan potongan harga hingga 10% untuk unit tertentu di Cluster Treasure Island!
 *         thumbnail_url:
 *           type: string
 *           example: https://example.com/thumbnail/promotion-1.jpg
 *         created_at:
 *           type: Date
 *           example: 2025-05-19T17:09:50.000Z
 *         expired_at:
 *           type: Date
 *           nullable: true
 *           example: 2025-12-31T23:59:59.000Z
 */

export interface BriefPromotion {
  id: number;
  title: string;
  thumbnail_url: string;
  created_at: Date;
}

export interface PromotionDetail {
  title: string;
  content: string;
  thumbnail_url: string;
  created_at: Date;
  expired_at: Date | null;
  cluster_id: number | null;
}
