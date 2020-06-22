const { UniqueConstraintError } = require("sequelize");
const { BadRequestError, ServerError, ValidationError } = require("app/utilities");

class MiddlewareError extends ServerError { };
module.exports.MiddlewareError = MiddlewareError;

const error_handler = (req, res, next) => {
  return e => {
    console.error("error handler", e);

    if (!e.constructor) {
      console.error(err.stack);
      return res.status(500).send(e);
    }

    const error = {
      type: e.constructor.name,
      message: e.message,
      code: e.code,
    };

    if (e instanceof ValidationError || e instanceof BadRequestError) {
      error.errors = e.errors;
    } else if (e instanceof ServerError) {
      error.code = 500;
    } else if (e instanceof UniqueConstraintError) {
      error.errors = e.errors;
    }

    res.status(error.code || 500).send({ error });
  }
};

module.exports.make = serve => {
  if (typeof serve !== "function")
    throw new MiddlewareError("invalid serve function");

  return (req, res, next) => {
    const result = serve(req, res);
    return Promise.resolve(result)
      .then(() => next())
      .catch(error_handler(req, res, next));
  };
}