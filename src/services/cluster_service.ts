import { getFileFromS3, uploadFileToS3 } from "../utils/s3_command";
import db from "../configs/database";
import {
  AddClusterRequest,
  AddClusterResponse,
  AllClustersResponse,
  ClusterDetailResponse,
} from "../models/dtos/cluster_dto";

export async function getAllClusters(): Promise<AllClustersResponse> {
  const rows = await db.clusters.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      category: true,
      is_apartment: true,
      thumbnail_url: true,
      image_hotspots: {
        omit: { id: true, cluster_id: true, created_at: true },
      },
      products: {
        select: {
          _count: {
            select: {
              product_units: {
                where: { status: "ready" },
              },
            },
          },
        },
      },
    },
  });

  const processedRows = rows.map((row) => {
    const { products, thumbnail_url, ...rest } = row;
    const available_unit = products.reduce((sum, product) => sum + product._count.product_units, 0);
    const signedUrl = getFileFromS3(thumbnail_url);
    return { ...rest, available_unit, thumbnail_url: signedUrl };
  });

  const masterplan_url = getFileFromS3(""); // default URL ("/") is masterplan URL
  return { masterplan_url, clusters: processedRows };
}

export async function getClusterById(id: number): Promise<ClusterDetailResponse | null> {
  const row = await db.clusters.findUnique({
    where: { id },
    select: {
      name: true,
      address: true,
      category: true,
      is_apartment: true,
      map_url: true,
      products: {
        select: {
          id: true,
          name: true,
          default_price: true,
          corner_price: true,
          image_hotspots: {
            omit: { id: true, product_id: true, created_at: true },
          },
          product_images: {
            where: { is_primary: true },
            select: { image_url: true },
            take: 1,
          },
          product_units: {
            where: { status: "ready" },
            select: { name: true, type: true },
          },
        },
      },
    },
  });

  if (!row) return null;
  const { products, map_url, ...rest } = row;
  const processedProducts = products.map((product) => {
    const { default_price, corner_price, product_images, ...restProduct } = product;
    const thumbnail_url = getFileFromS3(product_images[0].image_url);
    const price1 = Number(default_price);
    const price2 = Number(corner_price);
    return { ...restProduct, default_price: price1, corner_price: price2, thumbnail_url };
  });

  const signedUrl = getFileFromS3(map_url);
  const processedRow = { ...rest, products: processedProducts, map_url: signedUrl };
  return processedRow;
}

export async function createCluster(
  clusterData: AddClusterRequest,
  thumbnail: Express.Multer.File,
  map: Express.Multer.File
): Promise<AddClusterResponse> {
  const { image_hotspots, ...rest } = clusterData;

  const thumbnail_url = await uploadFileToS3(thumbnail.buffer, thumbnail.mimetype, `${rest.name}/thumbnail`);
  const map_url = await uploadFileToS3(map.buffer, map.mimetype, `${rest.name}/map`);

  const result = await db.clusters.create({
    data: {
      ...rest,
      thumbnail_url,
      map_url,
      image_hotspots: {
        create: image_hotspots.map((hotspot) => ({
          shape: hotspot.shape,
          x: hotspot.x,
          y: hotspot.y,
          width: hotspot.width,
          height: hotspot.height,
          radius: hotspot.radius,
        })),
      },
    },
    omit: {
      created_at: true,
      updated_at: true,
    },
    include: {
      image_hotspots: {
        omit: { id: true, cluster_id: true, created_at: true },
      },
    },
  });
  return result;
}

export async function deleteClusterById() {}

export async function clusterExistsByName(name: string): Promise<boolean> {
  const cluster = await db.clusters.findUnique({
    where: { name },
  });
  return !!cluster;
}
