const express = require('express');
const morgan = require('morgan');

const authRouter = require('./routes/auth-routes');
const tourRouter = require('./routes/tour-routes');

const app = express();

const globalErrorHandler = require('./controller/error-controller');
const AppError = require('./utils/app-errors');

// Middleware morgan has been added as it is simply a HTTP request logger middleware for node.js
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// This will serve your public folder where you can put your static files and use throughout the application
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Add routes here
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/auth', authRouter);

// handle all the urls that couldn't be handled
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
