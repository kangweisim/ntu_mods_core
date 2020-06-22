const { GenericError } = require("app/utilities");

class DatasourceError extends GenericError {}

module.exports = { DatasourceError };