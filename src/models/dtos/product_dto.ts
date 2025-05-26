import { product_unit_status, product_unit_type } from "@prisma/client";

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductUnit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: A1
 *         type:
 *           type: string
 *           enum: [standard, corner]
 *           example: standard
 *     ProductFeature:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Tanah
 *         total:
 *           type: string
 *           example: 119 m²
 *     ProductSpecification:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Pondasi
 *         detail:
 *           type: string
 *           example: Bata ringan plester aci
 *     ClusterProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Alexandrite
 *         default_price:
 *           type: number
 *           example: 1000000000
 *         corner_price:
 *           type: number
 *           example: 3000000000
 *         units:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductUnit'
 *     ClusterProductUnit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Alexandrite
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClusterProduct'
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Alexandrite
 *         default_price:
 *           type: number
 *           example: 1000000000
 *         corner_price:
 *           type: number
 *           example: 3000000000
 *         product_images:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - https://example.com/images/product_1_main.jpg
 *             - https://example.com/images/product_1_sub.jpg
 *         product_units:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductUnit'
 *         product_features:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductFeature'
 *         product_specifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductSpecification'
 *         cluster:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: Treasure Island
 *             brochure_url:
 *               type: string
 *               nullable: true
 *               example: https://example.com/brochure/treasure_island.jpg
 */

export interface ProductResponse {
  id: number;
  name: string;
  default_price: number;
  corner_price: number;
  product_images: string[];
  product_units: ProductUnit[];
  product_features: ProductFeature[];
  product_specifications: ProductSpecification[];
  cluster: ClusterReference;
}

export interface ProductUnit {
  id: number;
  name: string;
  type: product_unit_type;
  status?: product_unit_status;
}

export interface ClusterProductUnit {
  id: number;
  name: string;
  products: ClusterProduct[];
}

interface ClusterProduct {
  id: number;
  name: string;
  default_price: number;
  corner_price: number;
  units: ProductUnit[];
}

interface ProductFeature {
  name: string;
  total: string;
}

interface ProductSpecification {
  name: string;
  detail: string;
}

interface ClusterReference {
  id: number;
  name: string;
  brochure_url: string | null;
}
