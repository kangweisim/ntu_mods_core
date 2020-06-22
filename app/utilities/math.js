const is_number = input => {
  return !isNaN(input) && isFinite(input);
}
module.exports.is_number = is_number;

module.exports.number_or_zero = input => {
  if (!is_number(input)) return 0;
  return +input;
}