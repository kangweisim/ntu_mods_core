const Datasource = require("app/models/datasource");
const { validators, model_options, delete_timestamps, generate_reference, input_validate } = require("app/utilities");
const sequelize = Datasource.source("default-db");

const Model = sequelize.define("topic", {
  name: validators.generic_string(45),
  description: validators.text(),
  lecture_hours: validators.number(),
  tutorial_hours: validators.number(),
  module_id: validators.foreign_key(),
}, model_options());

Model.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete_timestamps(values);
  return values;
};

Model.crud_validators = {
  update: [
    input_validate.trim("description", { clean: true }),
  ],
};

Model.crudspec = {
  search_columns: ["name", "description"],
  list_filter: (query, extras, options) => {
    if (query.sort) {
      let [key, order = "asc"] = query.sort.split(":");
      options.add_order([key, order]);
    }
    options.add_order(["created_at", "desc"]);
  },
};

module.exports = Model;