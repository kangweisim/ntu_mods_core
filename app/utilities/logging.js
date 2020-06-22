const list_endpoints = require("express-list-endpoints");
const moment = require("moment");
const winston = require("winston");
const WinstonDailyRotate = require("winston-daily-rotate-file");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.printf(({ message, timestamp }) => `${timestamp} ${message}`),
  transports: [
    new WinstonDailyRotate({
      filename: "./logs/application",
      datePattern: "YYYY-MM-DD[.log]",
    }),
  ]
});

if (process.env.NODE_ENV !== "production")
  logger.add(new winston.transports.Console());

function chirp() {
  const timestamp = moment().format("YYYYMMDD HH:mm:ss.SSS");
  logger.info({ message: [...arguments].join(" "), timestamp });
}


const print_endpoints = app => {
  const endpoints = list_endpoints(app);
  const lines = endpoints.reduce((accum, { methods, path }) => {
    return accum.concat(methods.map(method => {
      method = `${method}       `.substring(0, 7);
      return `  ${method} ${path}`;
    }))
  }, []);
  chirp(`endpoints list:\n${lines.join("\n")}`);
}
module.exports = { print_endpoints, chirp };