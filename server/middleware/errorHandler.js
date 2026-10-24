export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || "An unexpected server error occurred.";

  if (error.name === "ValidationError" || error.name === "CastError") {
    statusCode = 400;
    message = error.message;
  }

  if (error.name === "MongoServerSelectionError" || error.name === "MongooseServerSelectionError") {
    statusCode = 503;
    message = "The database is unavailable. Check the MongoDB connection and try again.";
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({ success: false, message });
}
