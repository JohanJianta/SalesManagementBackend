import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../configs/swagger_docs";

function swaggerUIEndpoints(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerUIEndpoints);
  });
}

export default swaggerUIEndpoints;