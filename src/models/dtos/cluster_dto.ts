import { cluster_category, image_hotspot_shape } from "@prisma/client";
import { ProductUnit } from "./product_dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     ImageHotspot:
 *       type: object
 *       properties:
 *         shape:
 *           type: string
 *           enum: [rectangle, circle]
 *           example: rectangle
 *         x:
 *           type: integer
 *           example: 200
 *         y:
 *           type: integer
 *           example: 300
 *         width:
 *           type: integer
 *           nullable: true
 *           example: 100
 *           description: used if shape is 'rectangle'
 *         height:
 *           type: integer
 *           nullable: true
 *           example: 100
 *           description: used if shape is 'rectangle'
 *         radius:
 *           type: integer
 *           nullable: true
 *           example: null
 *           description: used if shape is 'circle'
 *     BriefCluster:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Treasure Island
 *         address:
 *           type: string
 *           example: VC32+P38, Panambungan, Kota Makassar, Sulawesi Selatan
 *         category:
 *           type: string
 *           enum: [residential, commercial]
 *           example: residential
 *         is_apartment:
 *           type: boolean
 *           example: false
 *         thumbnail_url:
 *           type: string
 *           nullable: true
 *           example: https://example.com/thumbnail/treasure-island.jpg
 *         available_unit:
 *           type: integer
 *           example: 5
 *         image_hotspots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ImageHotspot'
 *     BriefProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Tipe 36
 *         default_price:
 *           type: number
 *           example: 1000000000
 *         corner_price:
 *           type: number
 *           example: 3000000000
 *         thumbnail_url:
 *           type: string
 *           example: https://example.com/images/product_1_main.jpg
 *         image_hotspots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ImageHotspot'
 *         product_units:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductUnit'
 *     AllClustersResponse:
 *       type: object
 *       properties:
 *         masterplan_url:
 *           type: string
 *           example: https://example.com/masterplan.jpg
 *         clusters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BriefCluster'
 *     ClusterDetailResponse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Treasure Island
 *         address:
 *           type: string
 *           example: VC32+P38, Panambungan, Kota Makassar, Sulawesi Selatan
 *         category:
 *           type: string
 *           enum: [residential, commercial]
 *           example: residential
 *         is_apartment:
 *           type: boolean
 *           example: false
 *         map_url:
 *           type: string
 *           nullable: true
 *           example: https://example.com/map/treasure-island.jpg
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BriefProduct'
 */

export interface AddClusterRequest {
  name: string;
  category: cluster_category;
  address: string;
  is_apartment: boolean;
  image_hotspots: ImageHotspot[];
}

export interface AddClusterResponse {
  id: number;
  name: string;
  category: cluster_category;
  is_apartment: boolean;
  address: string;
  thumbnail_url: string | null;
  map_url: string | null;
  image_hotspots: ImageHotspot[];
}

export interface AllClustersResponse {
  masterplan_url: string;
  clusters: BriefCluster[];
}

export interface ClusterDetailResponse {
  name: string;
  category: cluster_category;
  address: string;
  is_apartment: boolean;
  map_url: string | null;
  products: BriefProduct[];
}

interface BriefCluster {
  id: number;
  name: string;
  category: cluster_category;
  is_apartment: boolean;
  thumbnail_url: string | null;
  available_unit: number;
  image_hotspots: ImageHotspot[];
}

interface ImageHotspot {
  shape: image_hotspot_shape;
  x: number;
  y: number;
  width: number | null;
  height: number | null;
  radius: number | null;
}

interface BriefProduct {
  id: number;
  name: string;
  default_price: number;
  corner_price: number;
  thumbnail_url: string;
  image_hotspots: ImageHotspot[];
  product_units: ProductUnit[];
}
