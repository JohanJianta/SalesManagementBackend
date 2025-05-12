import { AddClusterSchema } from "../models/schemas/cluster_schema";
import { AddClusterRequest } from "../models/dtos/cluster_dto";
import { validateRequestBody } from "../utils/request_util";
import { Request, Response, NextFunction } from "express";
import { getSingleFile } from "../utils/request_util";
import { AppError } from "../utils/app_error";
import {
  getAllClusters,
  getClusterById,
  createCluster,
  deleteClusterById,
  clusterExistsByName,
} from "../services/cluster_service";

export async function fetchClusters(req: Request, res: Response, next: NextFunction) {
  try {
    const clusters = await getAllClusters();
    res.send(clusters);
  } catch (err) {
    next(err);
  }
}

export async function fetchClusterById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw AppError.BadRequest("id", "ID cluster tidak valid");

    const cluster = await getClusterById(Number(id));
    if (!cluster) throw AppError.NotFound("id", "Cluster tidak ditemukan");
    res.send(cluster);
  } catch (err) {
    next(err);
  }
}

export async function addCluster(req: Request, res: Response, next: NextFunction) {
  try {
    const rawBody = req.body;
    const parsedBody = {
      ...rawBody,
      is_apartment: rawBody.is_apartment === "true",
      image_hotspots: Array.isArray(rawBody.image_hotspots)
        ? rawBody.image_hotspots.map((hotspot: any) => ({
            ...hotspot,
            x: parseFloat(hotspot.x),
            y: parseFloat(hotspot.y),
            width: hotspot.width ? parseFloat(hotspot.width) : undefined,
            height: hotspot.height ? parseFloat(hotspot.height) : undefined,
            radius: hotspot.radius ? parseFloat(hotspot.radius) : undefined,
          }))
        : [],
    };

    const validatedData = validateRequestBody<AddClusterRequest>(parsedBody, AddClusterSchema);

    const clusterExist = await clusterExistsByName(validatedData.name);
    if (clusterExist) throw AppError.Conflict("name", "Nama cluster sudah digunakan");

    const files = req.files as Express.Multer.File[];
    const thumbnail = getSingleFile(files, "thumbnail");
    const map = getSingleFile(files, "map");

    const cluster = await createCluster(validatedData, thumbnail, map);
    res.send(cluster);
  } catch (err) {
    next(err);
  }
}

export async function removeClusterById(req: Request, res: Response, next: NextFunction) {}
