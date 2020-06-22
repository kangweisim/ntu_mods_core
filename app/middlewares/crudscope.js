const { chirp } = require("app/utilities");
const { make } = require("./middlewares");

module.exports = (scope) => {
  return make(async (req, res) => {
    chirp("m: crudscope", scope);
    req.extras.crudscope = scope;
  });
};