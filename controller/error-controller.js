const AppError = require('../utils/app-errors');
const { errors } = require('../utils/errors');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // Operational error:- send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error-> don't leak error details
  else {
    // 1) Log error
    console.error('Error ***', err);
    res.status(500).json({
      status: errors.ERROR,
      message: 'Something went wrong in the server',
    });
  }
};

const handleCastErrorDB = (error) => {
  const message = `Incalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};

// global error handling
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err,
    };
    // Checks for invalid requests
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};
