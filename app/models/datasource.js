const Sequelize = require("sequelize");
const config = require("config");
const { DatasourceError } = require("./errors");
const { chirp } = require("app/utilities");

class Datasource {

  constructor() {
    this.sources = {};
    let { datasources } = config.db;
    for (let datasource of datasources) {
      let { name, username, password, schema, options } = datasource;
      chirp(`init datasource ${name}`);
      let sequelize = new Sequelize(schema, username, password, options);
      sequelize.authenticate()
        .then(() => chirp(`connect datasource success ${name}`))
        .catch(e => chirp(`datasource failed`, e));
      this.sources[name] = sequelize;
    }
  }

  source(name) {
    if (!this.sources[name])
      throw new DatasourceError(`invalid datasource:${name}`);
    return this.sources[name];
  }
}

module.exports = new Datasource();