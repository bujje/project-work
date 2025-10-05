/**
 * Global error handling middleware
 */
const HandleError = (Err, Request, Response, Next) => {
  console.error('Error:', Err);

  const StatusCode = Err.statusCode || 500;
  const Message = Err.message || 'Internal server error';

  Response.status(StatusCode).json({
    Success: false,
    Message: Message,
    ...(process.env.NODE_ENV === 'development' && { Stack: Err.stack }),
  });
};

/**
 * Handle 404 errors
 */
const HandleNotFound = (Request, Response, Next) => {
  Response.status(404).json({
    Success: false,
    Message: 'Route not found',
  });
};

module.exports = {
  HandleError,
  HandleNotFound,
};