import swaggerJsDoc from "swagger-jsdoc";
import { version } from "../../package.json";

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
        description: "Local Development Server"
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
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;