const swaggerJsdoc = require('swagger-jsdoc');
const { version } = require('../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InternationalMind APIs',
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
