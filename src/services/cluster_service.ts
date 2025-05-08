import { FilteredCluster } from "../models/dtos/cluster_dto";
import db from "../configs/database";

export function getAllClusters(): Promise<FilteredCluster[]> {
  const rows = db.clusters.findMany({
    omit: { created_at: true, updated_at: true },
    include: {
      clickable_area: {
        omit: { created_at: true },
      },
    },
  });
  return rows;
}

export async function getClusterById(): Promise<void> { }

export async function createCluster(): Promise<void> { }

export async function deleteClusterById(): Promise<void> { }
