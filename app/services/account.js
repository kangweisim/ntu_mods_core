const bcrypt = require("bcrypt");
const { Person, Organisation, Entity, Credential, Datasource } = require("app/models");
const { BadRequestError } = require("app/utilities");
const sequelize = Datasource.source("default-db");

module.exports.register_account = async (owner_detail, owner_type, cred) => {
	let entity = null;
	await sequelize.transaction(async transaction => {
		let owner = null;
		if (owner_type === Organisation.name)
			owner = await Organisation.create(owner_detail, { transaction });
		else if (Person.name)
			owner = await Person.create(owner_detail, { transaction });
		else
			throw new BadRequestError(`invalid owner_type:${owner_type}`);

		entity = await Entity.create({ owner_type, owner_id: owner.id }, { transaction });
		await Credential.create({
			access_handle: cred.username, entity_id: entity.id,
			type: Credential.enums.TYPES.PASSWORD,
			secret: bcrypt.hashSync(cred.password, 10),
		}, { transaction });
	});

	const model = await Entity.scope(`admin_${owner_type}`).findByPk(entity.id);
	return model;
}