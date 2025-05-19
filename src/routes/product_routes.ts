import { addProduct, fetchProductById, removeProductById } from "../controllers/product_controller";
import { authenticateUserRole } from "../middlewares/auth_middleware";
import { fileUpload } from "../middlewares/multer_middleware";
import { Router } from "express";

const router = Router();

router.get("/products/:id", fetchProductById);
router.post("/products", authenticateUserRole, fileUpload, addProduct);
router.delete("/products/:id", authenticateUserRole, removeProductById);

export default router;
