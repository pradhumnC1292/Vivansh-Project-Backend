import {
  ValidationError,
  CastError,
  JWTError,
  DuplicateKeyError,
  ResourceNotFoundError,
  BadRequestError,
  ServerError,
} from "../utils/customErrors.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, errors: err.errors });
  }

  if (err instanceof CastError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof JWTError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof DuplicateKeyError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, field: err.field });
  }

  if (err instanceof ResourceNotFoundError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Handle all other errors as a server error
  return res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Server error" });
};

export default errorHandler;
