import { getAllClusters, getClusterById, createCluster, deleteClusterById } from "../services/cluster_service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/app_error";

export async function fetchClusters(req: Request, res: Response, next: NextFunction): Promise<void> { }
export async function fetchClusterById(req: Request, res: Response, next: NextFunction): Promise<void> { }
export async function addCluster(req: Request, res: Response, next: NextFunction): Promise<void> { }
export async function removeClusterById(req: Request, res: Response, next: NextFunction): Promise<void> { }
