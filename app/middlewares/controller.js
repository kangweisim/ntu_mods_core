const fs = require("fs");
const path = require("path");
const { make } = require("./middlewares");
const validate = require("./validate");

module.exports.make = (validations, serve) => {
  if (!serve && typeof validations === "function")
    serve = validations;
  if (!Array.isArray(validations))
    validations = [];

  return [make(async (req, res) => {
    res.result = {};
  }),
  validations,
  validate(),
  make(serve),
  make((req, res) => {
    let { result, meta, file } = res;
    if (!result) return;
    if (res.file) {
      res.status(200).send(file);
    } else {
      res.status(200).send({ result, meta });
    }
  })];
}