const AppError = require('./../utiles/appError');

// Handling Invalid Database IDs
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handling Duplicate Database Fields
const handleDuplicateFieldsDB = (err) => {
  //////////////////////////////////////////////////////// this is work
  // const errorValue = Object.entries(err.keyValue);
  // const message = `Duplicate Field value: ${errorValue}. Please use another value`;

  //////////////////////////////////////////////////////// this is work
  const duplicateValue = err.keyValue.name;
  const message = `Duplicate Field value: ${duplicateValue}. Please use another value`;

  //////////////////////////////////////////////////////// this is work
  // const keys = Object.keys(err.keyPattern);
  // const message = `Duplicate Field Value: ${
  //   err.keyValue[keys[0]]
  // } , Please Use another Value for ${keys[0]}`;

  return new AppError(message, 400);
};

// Handling Mongoose Validation Errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invaild input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handling JWT Errors
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again', 401);

// Errors During Development vs Production
const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Rendering Error Pages for Development //
  // B) RENDERED WEBSITE
  console.error('ERROR💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log Error
    console.error('ERROR💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // Rendering Error Pages for Production//
  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log Error
  console.error('ERROR💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.Node_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.Node_ENV === 'production') {
    // let error = JSON.stringify(err); // First Option
    // error = JSON.parse(error);
    let error = { ...err }; // Second Option
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // console.log(err.message);
    // console.log(error.message);
    sendErrorProd(error, req, res);
  }
};
