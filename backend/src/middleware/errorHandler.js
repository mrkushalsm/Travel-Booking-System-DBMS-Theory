const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const stack = env.nodeEnv === 'development' ? err.stack : undefined;

  res.status(statusCode).json({
    success: false,
    message,
    ...(stack ? { stack } : {})
  });
};

module.exports = errorHandler;
