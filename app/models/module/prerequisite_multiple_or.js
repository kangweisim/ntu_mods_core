const Datasource = require("app/models/datasource");
const { validators, model_options, delete_timestamps, generate_reference } = require("app/utilities");
const sequelize = Datasource.source("default-db");

const Model = sequelize.define("prerequisite_multiple_or", {
  module_id: validators.foreign_key(true),
  prerequisite_or_id: validators.foreign_key(true),
}, {
  freezeTableName: true, timestamps: false
});

Model.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete_timestamps(values);
  return values;
};


Model.crud_validators = {
};

Model.crudspec = {
  search_columns: [],
  list_filter: (query, extras, options) => {

    if (query.sort) {
      let [key, order = "asc"] = query.sort.split(":");
      options.add_order([key, order]);
    }
  },
};

module.exports = Model;