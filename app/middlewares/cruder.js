const { json } = require("express");
const { get_scoped_model, scope_exists, get_query_meta, ServerError } = require("app/utilities");
const { make } = require("./controller");
const parse_query = require("./parse_query");
const load_model = require("./load_model");

const crud_update = async (model, data, spec = [], extras) => {
  if (typeof spec === "function")
    spec = [spec];

  if (!Array.isArray(spec))
    throw new ServerError("unknown crudspec type");

  for (let i in spec) {
    let spec_item = spec[i];
    if (typeof spec_item === "string") {
      if (data[spec_item] !== undefined)
        model[spec_item] = data[spec_item];
    } else if (typeof spec_item === "function") {
      await spec_item(model, data, extras);
    }
  }
  return model;
};

module.exports.list = (model_def) => {
  const controller = make(async (req, res) => {
    const { crudscope = "public" } = req.extras;
    const listscope = `${crudscope}_list`;
    const scoped_model_def = get_scoped_model(model_def, listscope, crudscope);

    const options = req.parse_query_options();
    const { crudspec } = model_def;

    if (req.query.search)
      options.search(req.query.search, crudspec.search_columns);

    if (crudspec.list_filter)
      crudspec.list_filter(req.query, req.extras, options);
    if (crudspec.list_includes)
      options.include = crudspec.list_includes;

    const { primary_key = "id" } = model_def;
    const count_col = options.include ? primary_key : `${scoped_model_def.getTableName()}.${primary_key}`;

    const models = await scoped_model_def.findAll(options);
    const count = await scoped_model_def.count({
      ...options,
      distinct: true,
      col: count_col,
    });
    res.result.models = models;
    res.result.meta = get_query_meta(options, count);
  });

  return [parse_query(), controller];
};

module.exports.create = (model_def) => {
  const { crud_validators } = model_def;
  const validators = [];
  if (crud_validators) {
    const { create = [] } = crud_validators;
    validators.push(...create);
  }

  const controller = make(validators, async (req, res) => {
    let { crudspec } = model_def;
    let model = new model_def();

    model = await crud_update(model, req.body, crudspec.create, req.extras);
    await model.save();

    res.result.model = model;
  });

  return [json(), controller];
};

module.exports.detail = (model_def) => {
  const model_key = model_def.name;
  const controller = make(async (req, res) => {
    const { primary_key = "id" } = model_def;
    const { crudscope = "public" } = req.extras;
    const listscope = `${crudscope}_detail`;
    const scoped_model_def = get_scoped_model(model_def, listscope, crudscope);

    let model = req.extras[model_key];

    
    const options = {};
    const { crudspec } = model_def;

    if (crudspec.detail_includes)
      options.include = crudspec.detail_includes;

    model = await scoped_model_def.findByPk(model[primary_key], options);

    res.result.model = model;
  });
  return [load_model(model_def), controller];
};

module.exports.update = (model_def) => {
  const { crud_validators } = model_def;
  const validators = [];
  if (crud_validators) {
    const { update = [] } = crud_validators;
    validators.push(...update);
  }

  const model_key = model_def.name;
  const controller = make(validators, async (req, res) => {
    const { crudspec } = model_def;
    const spec = crudspec.update || crudspec.create;
    let model = req.extras[model_key];
    model = await crud_update(model, req.body, spec, req.extras);
    await model.save();

    res.result.model = model;
  });
  return [load_model(model_def), json(), controller];
};

module.exports.destroy = (model_def) => {
  const model_key = model_def.name;
  const controller = make(async (req, res) => {
    let model = req.extras[model_key];
    model.destroy();
  });
  return [load_model(model_def), controller];
};


module.exports.child = (parent_def, child_def) => {
  const { crud_validators } = child_def;
  const validators = [];
  if (crud_validators) {
    const { create = [] } = crud_validators;
    validators.push(...create);
  }

  const controller = make(validators, async (req, res) => {
    const parent = req.extras[parent_def.name];
    if (!parent)
      throw new ServerError("parent not defined");

    const parent_key = `${parent_def.name}_id`;

    const { crudspec } = child_def;
    let model = new child_def();
    model[parent_key] = parent.id;

    model = await crud_update(model, req.body, crudspec.create, req.extras);
    await model.save();

    res.result.model = model;
  });

  return [json(), load_model(parent_def), controller];
};