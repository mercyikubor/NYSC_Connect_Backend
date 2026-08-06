import ApiError from "../utils/apierror.js";

// Central error handler. Anything thrown in a controller/service (wrapped by
// asyncHandler) ends up here via next(error).
const errorMiddleware = (err, req, res, _next) => {
  let error = err;

  // Normalize unexpected errors (e.g. a raw Sequelize error) into an
  // ApiError so the response shape is always the same.
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
  });
};

export default errorMiddleware;
