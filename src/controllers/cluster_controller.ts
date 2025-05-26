import { getAllClusters, getClusterById, createCluster, clusterExistsByName } from "../services/cluster_service";
import { safeJsonParse, validateRequestBody } from "../utils/request_util";
import { AddClusterSchema } from "../models/schemas/cluster_schema";
import { AddClusterRequest } from "../models/dtos/cluster_dto";
import { Request, Response, NextFunction } from "express";
import { getSingleFile } from "../utils/request_util";
import { AppError } from "../utils/app_error";

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
      is_apartment: rawBody.is_apartment === "true" ? true : rawBody.is_apartment === "false" ? false : null,
      image_hotspots: safeJsonParse<any[]>(rawBody.image_hotspots, []).map((hotspot) => ({
        shape: hotspot.shape,
        radius: hotspot.radius != null && hotspot.radius !== "" ? parseFloat(hotspot.radius) : null,
        points: Array.isArray(hotspot.points)
          ? hotspot.points.map((pt: any) => ({
              x: parseFloat(pt.x),
              y: parseFloat(pt.y),
            }))
          : [],
      })),
    };

    const validatedData = validateRequestBody<AddClusterRequest>(parsedBody, AddClusterSchema);

    const clusterExist = await clusterExistsByName(validatedData.name);
    if (clusterExist) throw AppError.Conflict("name", "Nama cluster sudah digunakan");

    const files = req.files as Express.Multer.File[];
    const thumbnail = getSingleFile(files, "thumbnail");
    const map = getSingleFile(files, "map");

    const cluster = await createCluster(validatedData, thumbnail, map);
    res.status(201).send(cluster);
  } catch (err) {
    next(err);
  }
}

export async function removeClusterById(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
