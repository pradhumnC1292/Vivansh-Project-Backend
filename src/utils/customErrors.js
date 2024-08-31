class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends CustomError {
  constructor(message, errors) {
    super(message, 400);
    this.errors = errors;
  }
}

class CastError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

class JWTError extends CustomError {
  constructor(message) {
    super(message, 401);
  }
}

class DuplicateKeyError extends CustomError {
  constructor(message, field) {
    super(message, 400);
    this.field = field;
  }
}

class ResourceNotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

class ServerError extends CustomError {
  constructor(message) {
    super(message, 500);
  }
}

export {
  CustomError,
  ValidationError,
  CastError,
  JWTError,
  DuplicateKeyError,
  ResourceNotFoundError,
  BadRequestError,
  ServerError,
};
