const moment = require("moment");

module.exports.substitute = (string, values_map) => {
  if (typeof string !== "string") return string;
  if (typeof values_map !== "object") return values_map;
  const keys = string.match(/(?<!:)(:[a-zA-Z]+)/g);
  if (!keys) return string;
  for (const key of keys)
    string = string.replace(RegExp(key, "g"), values_map[key.substr(1)] || "");
  return string.replace(/::/g, ":");
};

module.exports.parse_date = (value) => {
  if (typeof value === "number")
    return moment.unix(value);
  if (typeof value === "string" && value.match(/^\d{10}$/))
    return moment.unix(value);
  return moment(value);
};

module.exports.generate_preview = (string, { length = 255 } = {}) => {
  if (typeof string !== "string") return string;
  if (string.length < length) return string;
  return string.substring(0, length - 1) + "…";
};