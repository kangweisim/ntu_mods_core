const { chirp, get_scoped_model, ServerError, BadRequestError } = require("app/utilities");
const { make } = require("./middlewares");

module.exports = (model_def, optional) => {
  return make(async (req, res) => {
    chirp("m: load_model", model_def.name);

    let { primary_key = "id" } = model_def;
    let key = `${model_def.name}_${primary_key}`;
    let id = req.params[key];
    if (!id)
      throw new ServerError(`${key} not found in path`);

    const { crudscope = "public" } = req.extras;
    const listscope = `${crudscope}_detail`;
    const scoped_model_def = get_scoped_model(model_def, listscope, crudscope);
    let model = await scoped_model_def.findByPk(id);
    if (!optional && !model) {
      throw new BadRequestError("model not found");
    }
    req.extras[model_def.name] = model;
  });
};