const { validationResult } = require("express-validator");
const { chirp, ValidationError } = require("app/utilities");
const { make } = require("./middlewares");

module.exports = () => {
  return make(async (req, res) => {
    chirp("m: validate");
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new ValidationError(errors.mapped());
  });
};