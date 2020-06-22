const Datasource = require("app/models/datasource");
const { validators, model_options, delete_timestamps } = require("app/utilities");
const sequelize = Datasource.source("default-db");

const ObjectMeta = sequelize.define("objectmeta", {
  key: validators.generic_string(255, true),
  value: validators.generic_string(255),
  extra0: validators.generic_string(255),
  extra1: validators.generic_string(255),
  extra2: validators.generic_string(255),
  extra3: validators.generic_string(255),
  extra4: validators.generic_string(255),
  owner_type: validators.generic_string(255, true),
  owner_id: validators.foreign_key(true, 0),
}, model_options());

ObjectMeta.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete_timestamps(values);
  return values;
};

module.exports = ObjectMeta;