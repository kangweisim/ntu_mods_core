const { read, write } = require("./meta");

const SYSTEM_OWNER_KEY = "system:env";
const SYSTEM_OWNER_ID = 0;

module.exports.keys = {

};

module.exports.get_env = async (key, default_value) => {
  let value = await read(SYSTEM_OWNER_KEY, SYSTEM_OWNER_ID, key)
  return value === undefined ? default_value : value;
}
module.exports.set_env = async (key, value) => {
  return await write(SYSTEM_OWNER_KEY, SYSTEM_OWNER_ID, key, value);
}