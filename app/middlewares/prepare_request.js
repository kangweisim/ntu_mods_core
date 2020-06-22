const moment = require("moment");
const { chirp } = require("app/utilities");
const { make } = require("./middlewares");

const log_request = (req, res) => {
  let start = moment();
  return () => {
    let now = moment();
    let elapsed = `000000${now.diff(start, "millis")}`.substr(-6);
    let status = `    ${res.statusCode}`.substr(-4);
    chirp(elapsed, status, req.method, req.path);
  };
};

const finish_callback = (req, res) => {
  return () => {
    setTimeout(log_request(req, res));
  };
};

const prepare_request = () => {
  return make((req, res) => {
    chirp("m: prepare_request");
    req.attr = {
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      timestamp: () => timestamp.clone(),
    };
    req.extras = {};
    res.on("finish", finish_callback(req, res));
  });
};
module.exports = prepare_request;