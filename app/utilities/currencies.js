
const currencies = {
  SGD: {
    name: "Singapore Dollars",
    compression: 2,
    symbol: "SGD",
    country_code: "sg",
  },
};

module.exports.map = () => JSON.parse(JSON.stringify(currencies));
module.exports.list = () => Object.values(currencies);
module.exports.symbols = () => Object.values(currencies).map(currency => currency.symbol);