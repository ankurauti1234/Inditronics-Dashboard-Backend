const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "User Authentication API",
    version: "1.0.0",
    description:
      "API documentation for user registration, OTP verification, and login",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // Adjust this path as needed
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
