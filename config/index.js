const toml = require("toml");
const fs = require("fs");
const { chirp } = require("app/utilities");
const NODE_ENV = process.env.NODE_ENV || "development";

let config = {};

let load_config = filename => {
  let config_path = `${__dirname}/${filename}.toml`;
  try {
    chirp(`loading config "${config_path}"`);
    return toml.parse(fs.readFileSync(config_path, "utf8"));
  } catch (e) {
    chirp(`config "${config_path}" cannot be read`);
  }
};

let env_config = load_config(NODE_ENV);
Object.assign(config, env_config);

let local_config = load_config("local");
if (local_config)
  Object.assign(config, local_config);

module.exports = config;