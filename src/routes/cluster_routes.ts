import { fetchClusters, fetchClusterById, addCluster, removeClusterById } from "../controllers/cluster_controller";
import { fileUpload } from "../middlewares/multer_middleware";
import { Router } from "express";

const router = Router();
router.get("/clusters", fetchClusters);
router.get("/clusters/:id", fetchClusterById);
router.post("/clusters", fileUpload, addCluster);
router.delete("/clusters/:id", removeClusterById);

export default router;
