import { ClusterProductUnit, ProductResponse, ProductUnit } from "../models/dtos/product_dto";
import { getFileFromS3 } from "../utils/s3_command";
import db from "../configs/database";

export async function getProductById(id: number): Promise<ProductResponse | null> {
  const row = await db.products.findUnique({
    where: { id },
    omit: {
      cluster_id: true,
      created_at: true,
      updated_at: true,
    },
    include: {
      product_images: {
        orderBy: { is_primary: "desc" },
        select: { image_url: true },
      },
      product_features: {
        select: { name: true, total: true },
      },
      product_specifications: {
        select: { name: true, detail: true },
      },
      product_units: {
        where: { status: "ready" },
        select: { id: true, name: true, type: true },
      },
      clusters: {
        select: { id: true, name: true, brochure_url: true },
      },
    },
  });

  if (!row) return null;
  const { default_price, corner_price, product_images, clusters, ...rest } = row;
  const signedImages = product_images.map((image) => getFileFromS3(image.image_url));
  clusters.brochure_url = clusters.brochure_url ? getFileFromS3(clusters.brochure_url) : null;

  const processedRow = {
    ...rest,
    default_price: Number(default_price),
    corner_price: Number(corner_price),
    product_images: signedImages,
    cluster: clusters,
  };
  return processedRow;
}

export async function getAllProductUnits(): Promise<ClusterProductUnit[]> {
  const rows = await db.clusters.findMany({
    select: {
      id: true,
      name: true,
      products: {
        select: {
          id: true,
          name: true,
          default_price: true,
          corner_price: true,
          product_units: {
            where: { status: "ready" },
            select: { id: true, name: true, type: true },
          },
        },
      },
    },
  });

  const processedRows = rows.map((cluster) => {
    const { products, ...restCluster } = cluster;
    const processedProducts = products.map((product) => {
      const { default_price, corner_price, product_units, ...restProduct } = product;
      return {
        ...restProduct,
        default_price: Number(default_price),
        corner_price: Number(corner_price),
        units: product_units,
      };
    });
    return { ...restCluster, products: processedProducts };
  });

  return processedRows;
}

export function getProductUnitById(id: number): Promise<ProductUnit | null> {
  const row = db.product_units.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      type: true,
      status: true,
    },
  });
  return row;
}

export function createProduct() {}

export function deleteProductById() {}
