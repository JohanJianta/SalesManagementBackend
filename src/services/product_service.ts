import { ProductResponse } from "../models/dtos/product_dto";
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
        select: { name: true, type: true },
      },
      clusters: {
        select: { id: true, name: true },
      },
    },
  });

  if (!row) return null;
  const { default_price, corner_price, brochure_url, product_images, clusters, ...rest } = row;
  const signedBrochureUrl = brochure_url ? getFileFromS3(brochure_url) : null;
  const signedImages = product_images.map((image) => getFileFromS3(image.image_url));

  const processedRow = {
    ...rest,
    default_price: Number(default_price),
    corner_price: Number(corner_price),
    brochure_url: signedBrochureUrl,
    product_images: signedImages,
    cluster: clusters,
  };
  return processedRow;
}

export function createProduct() {}

export function deleteProductById() {}
