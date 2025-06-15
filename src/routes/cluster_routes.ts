import { fetchClusters, fetchClusterById, addCluster, removeClusterById } from "../controllers/cluster_controller";
import { authenticateUserRole } from "../middlewares/auth_middleware";
import { fileUpload } from "../middlewares/multer_middleware";
import { Router } from "express";

const router = Router();

/**
 * @openapi
 * paths:
 *   /clusters:
 *     get:
 *       tags:
 *         - Clusters
 *       summary: Get all clusters
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AllClustersResponse'
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal Server Error
 */
router.get("/", fetchClusters);

/**
 * @openapi
 * paths:
 *   /clusters/{id}:
 *     get:
 *       tags:
 *         - Clusters
 *       summary: Get cluster detail by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             example: 1
 *           description: ID of the cluster
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ClusterDetailResponse'
 *         400:
 *           description: Bad Request
 *         401:
 *           description: Unauthorized
 *         404:
 *           description: Not Found
 *         500:
 *           description: Internal Server Error
 */
router.get("/:id", fetchClusterById);

router.post("/", authenticateUserRole, fileUpload, addCluster);
router.delete("/:id", authenticateUserRole, removeClusterById);

export default router;
