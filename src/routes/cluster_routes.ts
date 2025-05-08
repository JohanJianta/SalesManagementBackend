import { fetchClusters, fetchClusterById, addCluster, removeClusterById } from "../controllers/cluster_controller";
import { Router } from "express";

const router = Router();
router.get("/clusters", fetchClusters);
router.get("/clusters/:id", fetchClusterById);
router.post("/clusters", addCluster);
router.delete("/clusters/:id", removeClusterById);

export default router;
