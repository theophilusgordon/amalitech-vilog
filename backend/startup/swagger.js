const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

// Extended: https://swagger.io/specification/#infoObject
const options = {
  definition: {
    info: {
      title: "AmaliTech ViLog API",
      description: "ViLog API for AmaliTech Services",
      contact: {
        name: "AmaliTech",
        email: "theophilus.gordon@amalitech.org",
      },
      servers: [""],
    },
    components: {
      securitySchemas: {
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
  apis: ["./backend/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  // Docs in JSON format
  app.get("api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Swagger Documentation is available at /${port}/api-docs`);
}

module.exports = swaggerDocs;
