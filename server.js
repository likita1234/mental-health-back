const dotenv = require('dotenv');
const AppError = require('./utils/app-errors');
const SwaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;

// import db connection
require('./config/db-connection');

// console.log(process.env.NODE_ENV);
const server = app.listen(port, () => {
  console.log(`App running on server:: localhost:${port}...`);
});

// Swagger By Default in the begining
app.use('/', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec));
// Docs in JSON format
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// handle all the urls that couldn't be handled
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT Exception! Shutting down..');
  server.close(() => {
    process.exit(1);
  });
});

// Handles all the unhandled promises errors in the overall application
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down..');
  server.close(() => {
    process.exit(1);
  });
});
