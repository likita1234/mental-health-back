const AppError = require('../utils/app-errors');
const { ErrorStates } = require('../utils/errors');

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
      status: ErrorStates.ERROR,
      message: 'Something went wrong in the server',
    });
  }
};

const handleCastErrorDB = (error) => {
  const message = `Incalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
  const values = Object.keys(error.keyPattern).join(', ');
  const message = `Duplicate fields found: ${values}. Please use another values!.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(' ')}`;
  return AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please re login', 401);

const handleJWTExpired = () =>
  new AppError('Your token has expired. Please re login to continue!', 401);

// global error handling
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  const environmentMode = process.env.NODE_ENV;
  if (environmentMode === 'development') {
    sendErrorDev(err, res);
  } else if (environmentMode === 'production') {
    let error = {
      ...err,
      // issue with messages not being shown sometimes, so we are manually inserting it separately as well
      message: err.message,
    };
    // Checks for invalid requests
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonwebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpired();
    sendErrorProd(error, res);
  }
};
