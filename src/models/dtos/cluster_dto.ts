import { clusters_category, clickable_areas_shape, clickable_areas } from "@prisma/client";

export interface FilteredCluster {
  id: number;
  name: string;
  category: clusters_category;
  address: string;
  is_apartment: boolean;
  thumbnail_url: string;
  map_url: string;
  clickable_area: FilteredClickableArea;
}

export interface FilteredClickableArea {
  shape: clickable_areas_shape
  x1: number;
  y1: number;
  x2: number | null;
  y2: number | null;
  radius: number | null;
}