import { endpointNotFoundHandler, globalErrorHandler } from "./utils/app_error";
import { authenticateJWT } from "./middlewares/auth_middleware";
import promotionRoutes from "./routes/promotion_routes";
import bookingRoutes from "./routes/booking_routes";
import clusterRoutes from "./routes/cluster_routes";
import productRoutes from "./routes/product_routes";
import userRoutes from "./routes/user_routes";
import authRoutes from "./routes/auth_routes";
import swaggerApp from "./configs/swagger";
import express, { json } from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(json());

app.use("/api", authRoutes);
app.use("/api", authenticateJWT, userRoutes);
app.use("/api", authenticateJWT, clusterRoutes);
app.use("/api", authenticateJWT, productRoutes);
app.use("/api", authenticateJWT, promotionRoutes);
app.use("/api", authenticateJWT, bookingRoutes);
swaggerApp(app);

app.use(endpointNotFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger available at endpoint /api-docs`);
});
