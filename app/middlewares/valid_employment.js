const { chirp, get_scoped_model, AuthError } = require("app/utilities");
const { Employment } = require("app/models");
const EnvironService = require("app/services/environ");
const { make } = require("./middlewares");

module.exports = (optional) => {
  return make(async (req, res) => {
    chirp("m: valid_employment");

    const { self } = req.extras;

    const organisation_id = await EnvironService.get_env(EnvironService.keys.PRIMARY_COMPANY);
    const employment = await Employment.scope("self").findOne({
      where: {
        person_id: self.person.id,
        organisation_id,
      },
    });

    if (!employment && !optional)
      throw new AuthError("privilege");
    req.extras.self_employment = employment;
  });
};