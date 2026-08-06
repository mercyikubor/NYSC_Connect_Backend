// Wraps an async route/middleware function so that any rejected promise
// (including a thrown ApiError) is forwarded to next(), instead of crashing
// the process or requiring a try/catch in every controller.
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export default asyncHandler;