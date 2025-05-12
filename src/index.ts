import { authenticateJWT } from "./middlewares/auth_middleware";
import express, { json, ErrorRequestHandler } from "express";
import clusterRoutes from "./routes/cluster_routes";
import userRoutes from "./routes/user_routes";
import authRoutes from "./routes/auth_routes";
import { AppError } from "./utils/app_error";
import swagger from "./configs/swagger";
import multer from "multer";
import "dotenv/config";

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(json());
app.use("/api", authRoutes);
app.use("/api", authenticateJWT, userRoutes);
app.use("/api", authenticateJWT, clusterRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ errors: err.errors });
  } else if (err instanceof multer.MulterError) {
    res.status(400).json({
      errors: [{ field: err.field, message: err.message }],
    });
  } else {
    console.error(err.stack);
    res.status(500).json({
      errors: [{ field: "server", message: "Terjadi kesalahan di server" }],
    });
  }
};
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  swagger(app);
  console.log(`Swagger available at endpoint /api-docs`);
});
