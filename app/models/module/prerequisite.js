const Datasource = require("app/models/datasource");
const { validators, model_options, delete_timestamps, generate_reference } = require("app/utilities");
const Module = require("./module");
const sequelize = Datasource.source("default-db");

const Model = sequelize.define("prerequisite", {
  module_id: validators.foreign_key(true),
  required_id: validators.foreign_key(false),
}, model_options());

Model.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete_timestamps(values);
  return values;
};


Model.crud_validators = {
};

Model.crudspec = {
  search_columns: [],
  list_includes: [{
    model: Module,
    as: "module"
  }, {
    model: Module,
    as: "required"
  }],
  list_filter: (query, extras, options) => {
    if (query.required_id) {
      options.where.required_id = query.required_id
      options.limit = 99999;
    }
    if (query.sort) {
      let [key, order = "asc"] = query.sort.split(":");
      options.add_order([key, order]);
    }
  },
};

module.exports = Model;