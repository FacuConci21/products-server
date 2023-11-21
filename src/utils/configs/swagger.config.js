const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coder Ecommerce API",
      description: "API endpoint descriptions for this application",
    },
  },
  apis: [`${process.cwd()}/src/docs/**/*.yaml`],
};

const spec = swaggerJSDoc(swaggerOptions);

module.exports = {swaggerOptions, spec};