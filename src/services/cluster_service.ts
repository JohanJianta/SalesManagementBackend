import { ImageHotspot, RawImageHotspot } from "../models/dtos/cluster_dto";
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
    const { products, thumbnail_url, image_hotspots, ...rest } = row;
    const available_unit = products.reduce((sum, product) => sum + product._count.product_units, 0);
    const signedThumbnailUrl = thumbnail_url ? getFileFromS3(thumbnail_url) : null;
    const processedHotspots = transformImageHotspots(image_hotspots);
    return { ...rest, available_unit, thumbnail_url: signedThumbnailUrl, image_hotspots: processedHotspots };
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
            select: { id: true, name: true, type: true },
          },
        },
      },
    },
  });

  if (!row) return null;
  const { products, map_url, ...restCluster } = row;
  const processedProducts = products.map((product) => {
    const { default_price, corner_price, product_images, image_hotspots, ...restProduct } = product;
    const price1 = Number(default_price);
    const price2 = Number(corner_price);
    const signedThumbnailUrl = product_images.length != 0 ? getFileFromS3(product_images[0].image_url) : null;
    const processedHotspots = transformImageHotspots(image_hotspots);
    return {
      ...restProduct,
      default_price: price1,
      corner_price: price2,
      thumbnail_url: signedThumbnailUrl,
      image_hotspots: processedHotspots,
    };
  });

  const signedMapUrl = map_url ? getFileFromS3(map_url) : null;
  return { ...restCluster, products: processedProducts, map_url: signedMapUrl };
}

export async function createCluster(
  clusterData: AddClusterRequest,
  thumbnail: Express.Multer.File | null,
  map: Express.Multer.File | null
): Promise<AddClusterResponse> {
  const { image_hotspots, ...rest } = clusterData;

  const thumbnail_url = thumbnail
    ? await uploadFileToS3(thumbnail.buffer, thumbnail.mimetype, `cluster_thumbnails`)
    : null;
  const map_url = map ? await uploadFileToS3(map.buffer, map.mimetype, `cluster_maps`) : null;

  const result = await db.clusters.create({
    data: {
      ...rest,
      thumbnail_url,
      map_url,
      image_hotspots: {
        create: image_hotspots.map((hotspot) => ({
          shape: hotspot.shape,
          points: hotspot.points ?? [],
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

  const { image_hotspots: hotspotsResult, ...restResult } = result;
  const processedHotspots = transformImageHotspots(hotspotsResult);
  return { ...restResult, image_hotspots: processedHotspots };
}

export async function deleteClusterById() {}

export async function clusterExistsByName(name: string): Promise<boolean> {
  const cluster = await db.clusters.findUnique({ where: { name } });
  return !!cluster;
}

function transformImageHotspots(data: RawImageHotspot[]): ImageHotspot[] {
  return data.map((item) => {
    const { shape, points, radius } = item;
    switch (shape) {
      case "rectangle":
        const rectPoints = Array.isArray(item.points) ? (item.points as { x: number; y: number }[]) : [];
        if (rectPoints.length != 2) throw Error(`Rectangle image hotspot has ${rectPoints.length} point(s)`);
        return {
          shape,
          x: rectPoints[0].x,
          y: rectPoints[0].y,
          width: rectPoints[1].x - rectPoints[0].x,
          height: rectPoints[1].y - rectPoints[0].y,
        };

      case "circle":
        const circlePoints = Array.isArray(item.points) ? (item.points as { x: number; y: number }[]) : [];
        if (circlePoints.length != 1) throw Error(`Circle image hotspot has ${circlePoints.length} point(s)`);
        return {
          shape,
          x: circlePoints[0].x,
          y: circlePoints[0].y,
          radius: radius ?? 0,
        };

      case "polygon":
        return {
          shape,
          points: Array.isArray(item.points) ? (item.points as { x: number; y: number }[]) : [],
        };

      default:
        throw Error(`Unsupported shape: ${item.shape}`);
    }
  });
}
