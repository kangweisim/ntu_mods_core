class GenericError extends Error {
  constructor(message) {
    super(message);
  }
}

class ServerError extends GenericError { }

class RequestError extends GenericError {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

class BadRequestError extends RequestError {
  constructor(message, extras) {
    super(400, message);
    if (extras)
      this.errors = extras;
  }
}

class ValidationError extends BadRequestError {
  constructor(errors) {
    super("validation error");
    this.errors = errors;
  }
}

class AuthError extends RequestError {
  constructor(type) {
    let message = "unauthorised";
    switch (type) {
      case "auth": message = "unauthorised:authorisation required"; break;
      case "token expired": message = "unauthorised:token expired"; break;
      case "token": message = "unauthorised:invalid token"; break;
      case "privilege": message = "unauthorised:privilege required"; break;
    }
    super(401, message);
  }
}

module.exports = { GenericError, RequestError, ServerError, BadRequestError, ValidationError, AuthError };