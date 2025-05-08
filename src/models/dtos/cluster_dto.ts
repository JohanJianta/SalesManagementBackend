import { clusters_category, clickable_areas } from "@prisma/client";

export interface FilteredCluster {
  id: number;
  name: string;
  category: clusters_category;
  address: string;
  isApartment: boolean;
  thumbnailUrl: string;
  mapUrl: string;
  clickableAreas: FilteredClickableArea;
}

export interface FilteredClickableArea {
  top: number;
  left: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}