import { endpointNotFoundHandler, globalErrorHandler } from "./utils/app_error";
import { authenticateJWT } from "./middlewares/auth_middleware";
import promotionRoutes from "./routes/promotion_routes";
import downloadRoutes from "./routes/download_routes";
import bookingRoutes from "./routes/booking_routes";
import clusterRoutes from "./routes/cluster_routes";
import productRoutes from "./routes/product_routes";
import userRoutes from "./routes/user_routes";
import authRoutes from "./routes/auth_routes";
import swaggerApp from "./configs/swagger";
import express, { json } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(json());

app.use("/api/downloads", downloadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateJWT, userRoutes);
app.use("/api/clusters", authenticateJWT, clusterRoutes);
app.use("/api/products", authenticateJWT, productRoutes);
app.use("/api/promotions", authenticateJWT, promotionRoutes);
app.use("/api/bookings", authenticateJWT, bookingRoutes);
swaggerApp(app);

app.use(endpointNotFoundHandler);
app.use(globalErrorHandler);

export default app;
