import { Express, Request, Response } from "express";
import { version } from "../../package.json";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import "dotenv/config";

const ec2PublicIp = process.env.EC2_PUBLIC_IP as string;
const port = parseInt(process.env.PORT || "3000", 10);

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sales Management REST API Documentation",
      version,
      description: "REST API documentation for the Sales Management application.",
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: "Local Development Server",
      },
      {
        url: `http://${ec2PublicIp}:${port}/api`,
        description: "EC2 Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/schemas/*.ts", "./src/models/dtos/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

function swaggerApp(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
  });
}

export default swaggerApp;
