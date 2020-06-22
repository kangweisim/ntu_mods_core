const Sequelize = require("sequelize");
const Base32 = require("base32");
const crypto = require("crypto");

const { DataTypes } = Sequelize;

const model_options = (options) => {
  options = options || {};
  return {
    timestamps: true,
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
    omitNull: true,
    defaultScope: {
      attributes: {
        exclude: ["deleted_at", "updated_at"]
      },
    },
    ...options
  };
};
const validators = {
  generic_string: (length = 45, required = false, unique = false) => ({
    type: Sequelize.STRING,
    allowNull: !required,
    unique,
    validate: {
      len: [0, length],
      notEmpty: required,
    }
  }), reference: () => ({
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 64],
      notEmpty: true,
    }
  }), number: (required = false, defaultValue) => ({
    type: Sequelize.INTEGER,
    allowNull: !required,
    defaultValue,
  }), email: (required = false) => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: {
      isEmail: true,
    }
  }), timestamp: (required = false) => ({
    type: Sequelize.DATE,
    allowNull: !required,
  }), date: (required = false) => ({
    type: Sequelize.DATEONLY,
    allowNull: !required,
  }), boolean: (required = false, defaultValue) => ({
    type: Sequelize.BOOLEAN,
    allowNull: !required,
    defaultValue,
  }), phone: (required = false) => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: {
      notEmpty: required,
    },
  }), url: (required = false) => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: {
      isUrl: true,
      notEmpty: required,
    },
  }), ip_address: (required = false) => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: {
      isIP: true,
      notEmpty: required,
    },
  }), currency: (required = false) => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: {
      len: 3,
      notEmpty: required,
    }
  }), currency_amount: (required = false, defaultValue) => ({
    type: Sequelize.DECIMAL(64, 0),
    allowNull: !required,
    defaultValue,
  }), foreign_key: (required = false) => ({
    type: Sequelize.INTEGER,
    allowNull: !required
  }), text: (required = false) => ({
    type: Sequelize.TEXT,
    allowNull: !required
  }), decimal: (required = false, m = 36, d = 2) => ({
    type: Sequelize.DECIMAL(m, d),
    allowNull: !required
  }), enum: (values = {}, required = false) => ({
    type: DataTypes.ENUM(Object.values(values)),
    allowNull: !required,
  })
};

const delete_timestamps = values => {
  delete values.created_at;
  delete values.updated_at;
  delete values.deleted_at;
};

const TIMESTAMP_KEYS = ["created_at", "updated_at", "deleted_at"];
const without_timestamps = () => {
  return TIMESTAMP_KEYS;
};

const generate_reference = (model, { prefix = "mdlg", length = 8, key = "reference" }) => {
  if (!model[key])
    model[key] = `${prefix}:${Base32.encode(crypto.randomBytes(length / 2)).substr(-length)}`.toUpperCase();
};

const null_omitter = (key, value) => {
  return value === null ? undefined : value;
};

const scope_exists = (model_def, scope) => {
  try {
    if (model_def.scope(scope))
      return true;
  } catch (e) {
    if (e.name === "SequelizeScopeError") {
      return false;
    } else {
      throw e;
    }
  }
};

const get_scoped_model = (model_def, ...scopes) => {
  for (const scope of scopes) {
    try {
      return model_def.scope(scope);
    } catch (e) {
      if (e.name === "SequelizeScopeError") {
        // scope not declared, its fine.
      } else {
        throw e;
      }
    }
  }
  return model_def;
};

const get_query_meta = (options, count) => {
  return {
    count,
    limit: options.limit,
    offset: options.offset,
    search: options.search_value
  };
};

const validate_dependent = (model_def_name, foreign_key = null) => {
  return async (model, data, extras) => {
    const Models = require("app/models");
    const model_def = Models[model_def_name];
    if (!model_def) {
      const { ServerError } = require("./errors");
      throw new ServerError(`invalid model def name:${model_def_name}`);
    }

    const key = foreign_key || `${model_def.name}_id`;
    const dependent_id = data[key];
    const dependent = await model_def.findByPk(dependent_id);
    if (!dependent) {
      const { BadRequestError } = require("./errors");
      throw new BadRequestError(`dependent not found:${model_def.name}:${dependent_id}`);
    }
  }
};

module.exports = {
  validators, model_options, delete_timestamps, without_timestamps,
  generate_reference, null_omitter,
  scope_exists, get_scoped_model, get_query_meta,
  validate_dependent,
};