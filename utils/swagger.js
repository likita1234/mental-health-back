const swaggerJsdoc = require('swagger-jsdoc');
const { version } = '../package.json';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docs',
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['../routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);


module.exports = swaggerSpec;
