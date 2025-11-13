const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "Backend API for task management assignment"
    },
    servers: [
      { url: "http://localhost:4000", description: "Local server" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [] // We won't scan files automatically; you can add JSDoc comments later.
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
