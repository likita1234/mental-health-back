const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware morgan has been added as it is simply a HTTP request logger middleware for node.js
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// This will serve your public folder where you can put your static files and use throughout the application
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Add routes here

// handle all the urls that couldn't be handled 
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
