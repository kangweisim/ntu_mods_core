const cors = require("cors");

module.exports = () => {
  return cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
  });
};