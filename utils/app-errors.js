const { ErrorStates } = require('./errors');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')
      ? ErrorStates.FAILED
      : ErrorStates.ERROR;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
