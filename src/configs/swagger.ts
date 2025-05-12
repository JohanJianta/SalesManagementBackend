import { Express, Request, Response } from "express";
import { version } from "../../package.json";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

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
        url: "http://localhost:3000/api",
        description: "Local Development Server",
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
  apis: ["./src/routes/*.ts", "./src/models/schemas/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

function swagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swagger);
  });
}

export default swagger;
