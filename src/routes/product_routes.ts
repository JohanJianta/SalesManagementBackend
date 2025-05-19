import { addProduct, fetchProductById, removeProductById } from "../controllers/product_controller";
import { fileUpload } from "../middlewares/multer_middleware";
import { Router } from "express";

const router = Router();

router.get("/products/:id", fetchProductById);
router.post("/products", fileUpload, addProduct);
router.delete("/products/:id", removeProductById);

export default router;
