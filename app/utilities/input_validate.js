const { check } = require("express-validator");
const moment = require("moment");
const bcrypt = require("bcrypt");

const c_required = ({ chain, name }) => {
  return chain.not().isEmpty().withMessage(`${name} is required`).bail();
};
const c_password = ({ chain }) => {
  return chain.customSanitizer(value => typeof value === "string" ? bcrypt.hashSync(value, 10) : undefined);
};
const c_not_null = ({ chain, name }) => {
  return chain.custom(value => {
    if (value === null) throw new Error();
    return true;
  }).withMessage(`${name} cannot be null`).bail();
};
const c_not_empty = ({ chain, name }) => {
  return chain.custom(value => {
    if (value === "") throw new Error();
    return true;
  }).withMessage(`${name} cannot be empty`).bail();
};
const c_timestamp = ({ chain, name }) => {
  return chain
    .customSanitizer(value => {
      if (typeof value === "number")
        return moment.unix(value);
      if (typeof value === "string" && value.match(/^\d{10}$/))
        return moment.unix(value);
      return moment(value);
    }).custom(value => {
      if (!value.isValid()) throw new Error();
      return true;
    }).withMessage(`${name} is not a unix timestamp`).bail();
};
const c_enum = ({ chain, values }) => {
  return chain.isIn(Object.values(values))
    .withMessage(`Accepted values: ${Object.values(values).join(" | ")}`).bail();
};
const c_number = ({ chain, name }) => {
  return chain.isNumeric()
    .withMessage(`${name} must be a number`).bail();
};
const c_boolean = ({ chain, name }) => {
  return chain.isBoolean()
    .withMessage(`${name} must be a true or false`).bail();
};
const c_format_field_name = field => {
  return field.replace(/[_-]/, " ").replace(/^\w/, c => c.toUpperCase());
};
const c_trim = ({ chain }) => {
  return chain.customSanitizer(value => typeof value === "string" ? value.trim() : value);
};
const c_lowercase = ({ chain }) => {
  return chain.customSanitizer(value => typeof value === "string" ? value.toLowerCase() : value);
};
const c_uppercase = ({ chain }) => {
  return chain.customSanitizer(value => typeof value === "string" ? value.toUpperCase() : value);
};
const c_clean = ({ chain }) => {
  return chain.customSanitizer(value => value === "" ? null : value);
};

module.exports.not_null = (inputs, { checker = check, or_empty = true, lowercase = false, uppercase = false, trim = true } = {}) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);
    let chain = checker(input);
    if (trim)
      chain = c_trim({ chain });
    if (lowercase)
      chain = c_lowercase({ chain });
    if (uppercase)
      chain = c_uppercase({ chain });

    chain = c_not_null({ chain, name });
    if (or_empty) {
      chain = c_not_empty({ chain, name });
    }
    chains.push(chain);
  }
  return chains;
};
module.exports.trim = (inputs, { checker = check, lowercase = false, uppercase = false, clean = true } = {}) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    let chain = checker(input);
    chain = c_trim({ chain });
    if (lowercase)
      chain = c_lowercase({ chain });
    if (uppercase)
      chain = c_uppercase({ chain });
    if (clean)
      chain = c_clean({ chain });
    chains.push(chain);
  }
  return chains;
};
module.exports.required = (inputs, { checker = check, trim = true, lowercase = false, uppercase = false } = {}) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);
    let chain = checker(input);
    chain = c_required({ chain, name });
    if (trim)
      chain = c_trim({ chain });
    if (lowercase)
      chain = c_lowercase({ chain });
    if (uppercase)
      chain = c_uppercase({ chain });
    chains.push(chain);
  }
  return chains;
};
module.exports.enum = (inputs, values, { optional = false, checker = check, trim = true, lowercase = false, uppercase = false } = {}) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    if (!optional)
      chain = c_required({ chain, name });
    if (trim)
      chain = c_trim({ chain });
    if (lowercase)
      chain = c_lowercase({ chain });
    if (uppercase)
      chain = c_uppercase({ chain });

    if (optional)
      chain.optional();
    chain = c_enum({ chain, values });
    chains.push(chain);
  }
  return chains;
};
module.exports.number = (inputs, { optional = false, checker = check, } = {}) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    if (!optional)
      chain = c_required({ chain, name });
    chain = c_trim({ chain });

    if (optional)
      chain.optional();
    chain = c_number({ chain, name });
    chains.push(chain);
  }
  return chains;
};
module.exports.boolean = (inputs, { optional = false, checker = check, } = {}) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    if (!optional)
      chain = c_required({ chain, name });
    chain = c_trim({ chain });

    if (optional)
      chain.optional();
    chain = c_boolean({ chain, name });
    chains.push(chain);
  }
  return chains;
};
module.exports.timestamp = (inputs, { optional = false, checker = check } = {}) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);

    let chain = checker(input);
    if (!optional)
      chain = c_required({ chain, name });
    chain = c_trim({ chain });

    if (optional)
      chain.optional();
    chain = c_timestamp({ chain });
    chains.push(chain);
  }
  return chains;
};
module.exports.password = (inputs, { checker = check, optional = false } = {}) => {
  if (!Array.isArray(inputs))
    inputs = [inputs];

  const chains = [];
  for (const input of inputs) {
    const name = c_format_field_name(input);
    let chain = checker(input);
    if (!optional)
      chain = c_required({ chain, name });
    c_password({ chain });
    chains.push(chain);
  }
  return chains;
};