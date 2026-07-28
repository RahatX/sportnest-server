export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong.";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(" ");
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id.";
  }

  if (error.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(error.keyPattern || {}).join(", ");
    message = fields ? `${fields} already exists.` : "Duplicate record exists.";
  }

  res.status(statusCode).json({
    message,
    statusCode,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
}

