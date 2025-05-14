import { endpointNotFoundHandler, globalErrorHandler } from "./utils/app_error";
import { authenticateJWT } from "./middlewares/auth_middleware";
import clusterRoutes from "./routes/cluster_routes";
import userRoutes from "./routes/user_routes";
import authRoutes from "./routes/auth_routes";
import swaggerApp from "./configs/swagger";
import express, { json } from "express";
import "dotenv/config";

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(json());
app.use("/api", authRoutes);
app.use("/api", authenticateJWT, userRoutes);
app.use("/api", authenticateJWT, clusterRoutes);

app.use(endpointNotFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  swaggerApp(app);
  console.log(`Swagger available at endpoint /api-docs`);
});
