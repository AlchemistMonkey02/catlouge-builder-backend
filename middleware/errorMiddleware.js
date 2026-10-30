/**
 * Handles requests to routes that don't exist (404).
 * Placed after all real routes in server.js.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized error handler. Every controller uses `next(error)` on
 * failure instead of handling errors inline, so all error responses
 * end up shaped consistently by this single function.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server error";

  // Malformed MongoDB ObjectId (e.g. GET /api/products/123)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Product not found (invalid id)";
  }

  // Mongoose schema validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
