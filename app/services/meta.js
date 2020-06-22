const { ObjectMeta } = require("app/models");

const create_or_update = (owner_type, owner_id, key, value) => {
  return meta => {
    if (meta) {
      meta.value = value;
    } else {
      meta = new ObjectMeta({ owner_type, owner_id, key, value });
    }
    return meta.save();
  }
};


module.exports.get = async (owner_type, owner_id, key) => {
  return ObjectMeta.findOne({
    where: {
      owner_type, owner_id, key
    }
  });
};
module.exports.get_by_model = async (owner, key) => {
  return this.get(owner.constructor.getTablename(), owner.id, key);
};

module.exports.read = async (owner_type, owner_id, key) => {
  return this.get(owner_type, owner_id, key)
    .then(meta => meta && meta.value);
};
module.exports.read_by_model = async (owner, key) => {
  return this.write(owner.constructor.getTablename(), owner.id, key, value)
};

module.exports.write = async (owner_type, owner_id, key, value) => {
  return this.get(owner_type, owner_id, key)
    .then(create_or_update(owner_type, owner_id, key, value));
};
module.exports.write_by_model = async (owner, key, value) => {
  return this.write(owner.constructor.getTablename(), owner.id, key, value)
};

module.exports.destroy = async (owner, key) => {
  return this.destroy(owner.constructor.getTablename(), owner.id, key);
}
module.exports.destroy = async (owner_type, owner_id, key) => {
  return this.get(owner_type, owner_id, key)
    .then(meta => meta && meta.destroy());
}