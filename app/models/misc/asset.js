const Datasource = require("app/models/datasource");
const { validators, model_options, generate_reference } = require("app/utilities");
const sequelize = Datasource.source("default-db");

const HOST = {
  local_filesystem: "local:filesystem",
  aws_s3: "aws:s3",
};

const Model = sequelize.define("asset", {
  reference: validators.reference(),
  uri: validators.generic_string(999),
  pathname: validators.generic_string(999),
  host: validators.generic_string(255),
  alt_text: validators.generic_string(255),
  filename: validators.generic_string(255),
  filesize: validators.number(),
  content_type: validators.generic_string(255),
  viewable_type: validators.generic_string(255),
  viewable_id: validators.foreign_key(),
  type: validators.generic_string(255),
}, model_options());

Model.enums = { HOST };

Model.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.pathname;
  delete values.host;
  delete values.prefix;

  delete values.viewable_type;
  delete values.viewable_id;

  return values;
};

Model.beforeValidate(model => {
  generate_reference(model, { prefix: "asst" });
});

Model.crudspec = {
  list_filter: (query, extras, options) => {
    options.add_order(["created_at", "desc"]);
  }
}

module.exports = Model;