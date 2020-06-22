const Sequelize = require("sequelize");
const moment = require("moment");
const { chirp, number_or_zero, BadRequestError } = require("app/utilities");
const { Op } = Sequelize;

const parse_query_options = (req, res) => {
  return query => {
    query = query || req.query || {};

    let options = {
      limit: number_or_zero(query.limit) || 10,
      offset: number_or_zero(query.offset) || 0,
      where: {},
    };
    options.search = (search, columns) => {
      options.search_value = search;
      options.where[Op.or] = columns.map(column => ({ [column]: { [Op.like]: `%${search}%` } }));
    };
    options.add_include = specs => {
      if (!options.include) options.include = [];
      options.include.push(specs);
    };
    options.add_order = specs => {
      if (!options.order) options.order = [];
      options.order.push(specs);
    };
    options.filter_date = (dates = {}, column = "created_at") => {
      let { first_date, last_date } = dates;
      if (!first_date && !last_date) return;
      if (!options.where[column]) options.where[column] = {};

      if (first_date)
        options.where[column][Op.gte] = moment.unix(first_date);
      if (last_date)
        options.where[column][Op.lt] = moment.unix(last_date);
    };
    options.add_attr_include = inclusion => {
      if (!options.attributes) options.attributes = {};
      let { attributes } = options;
      if (!attributes.include) attributes.include = [];
      attributes.include.push(inclusion);
    };
    options.add_attr_exclude = exclusion => {
      if (!options.attributes) options.attributes = {};
      let { attributes } = options;
      if (!options.attributes.exclude) attributes.exclude = [];
      attributes.exclude.push(exclusion);
    };

    if (options.limit > 100000)
      throw new BadRequestError("max pagination limit is 100000");
    if (options.offset < 0)
      throw new BadRequestError(`invalid offset ${options.offset}`);

    return options;
  };
}

module.exports = () => {
  return (req, res, next) => {
    chirp("m: parse_query");
    req.parse_query_options = parse_query_options(req, res);
    next();
  }
}