const Datasource = require("app/models/datasource");
const { validators, model_options, delete_timestamps, generate_reference } = require("app/utilities");
const { Prerequisite, PrerequisiteMultipleOr, PrerequisiteOr } = require(".");
const sequelize = Datasource.source("default-db");

const Model = sequelize.define("module", {
  code: validators.generic_string(45),
  title: validators.generic_string(255),
  year: validators.number(),
  au: validators.number(),
  course_aims: validators.text(),
  ilo: validators.text(),
}, model_options());

Model.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete_timestamps(values);
  return values;
};


Model.crud_validators = {
};

Model.crudspec = {
  search_columns: ["code", "title"],
  
  list_filter: (query, extras, options) => {

    if (query.sort) {
      let [key, order = "asc"] = query.sort.split(":");
      options.add_order([key, order]);
    }
  },
};

module.exports = Model;