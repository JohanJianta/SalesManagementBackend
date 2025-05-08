import { authenticateJWT } from "./middlewares/auth_middleware";
import express, { json, ErrorRequestHandler } from "express";
import userRoutes from "./routes/user_routes";
import authRoutes from "./routes/auth_routes";
import clusterRoutes from "./routes/cluster_routes";
import { AppError } from "./shared/app_error";
import "dotenv/config";

const app = express();
const port = process.env.EXPRESS_PORT as string || 3000;

app.use(json());
app.use("/api", authRoutes);
app.use("/api/protected", authenticateJWT, userRoutes);
app.use("/api/protected", authenticateJWT, clusterRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ errors: err.errors });
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
});
