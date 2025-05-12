import { cluster_category, image_hotspot_shape, product_unit_type } from "@prisma/client";

export interface AddClusterRequest {
  name: string;
  category: cluster_category;
  address: string;
  is_apartment: boolean;
  image_hotspots: FilteredImageHotspot[];
}

export interface AddClusterResponse {
  id: number;
  name: string;
  category: cluster_category;
  is_apartment: boolean;
  address: string;
  thumbnail_url: string;
  map_url: string;
  image_hotspots: FilteredImageHotspot[];
}

export interface AllClustersResponse {
  masterplan_url: string;
  clusters: BriefCluster[];
}

export interface ClusterDetailResponse {
  name: string;
  category: cluster_category;
  address: string;
  is_apartment: boolean;
  map_url: string;
  products: BriefProduct[];
}

interface BriefCluster {
  id: number;
  name: string;
  category: cluster_category;
  is_apartment: boolean;
  thumbnail_url: string;
  available_unit: number;
  image_hotspots: FilteredImageHotspot[];
}

interface FilteredImageHotspot {
  shape: image_hotspot_shape;
  x: number;
  y: number;
  width: number | null;
  height: number | null;
  radius: number | null;
}

interface BriefProduct {
  id: number;
  name: string;
  default_price: number;
  corner_price: number;
  thumbnail_url: string | null;
  image_hotspots: FilteredImageHotspot[];
  product_units: BriefProductUnit[];
}

interface BriefProductUnit {
  name: string;
  type: product_unit_type;
}
