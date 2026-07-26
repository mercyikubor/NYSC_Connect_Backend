import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NYSC Connect API",
      version: "1.0.0",
      description: "API Documentation for NYSC Connect Backend",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
      },
    ],
  },

  apis: ["./src/modules/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);