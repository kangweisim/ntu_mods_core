const { without_timestamps } = require("app/utilities");
const Datasource = require("./datasource");
const GroupMisc = require("./misc");
const GroupModule = require("./module");
const sequelize = Datasource.source("default-db");

module.exports = {
  Datasource,
  ...GroupMisc,
  ...GroupModule,
};

const { ObjectMeta, Asset } = GroupMisc;
const { Module, Topic, Prerequisite, PrerequisiteOr, PrerequisiteMultipleOr } = GroupModule;

Module.hasMany(Prerequisite, {
  foreignKey: "module_id",
});

Prerequisite.belongsTo(Module, {
  foreignKey: "module_id",
  as: "module"
})


Prerequisite.hasMany(PrerequisiteOr, {
  foreignKey: "prerequisite_id",
  as: "or"
});

Module.belongsToMany(PrerequisiteOr, {
  through: PrerequisiteMultipleOr,
  otherKey: "module_id",
  foreignKey: "prerequisite_or_id"
});

PrerequisiteOr.belongsToMany(Module, {
  through: PrerequisiteMultipleOr,
  otherKey: "module_id",
  foreignKey: "prerequisite_or_id"
});

PrerequisiteOr.hasMany(PrerequisiteMultipleOr, {
  foreignKey: "prerequisite_or_id",
  as: "and"
});

PrerequisiteMultipleOr.belongsTo(Module, {
  foreignKey: "module_id"
});

Prerequisite.belongsTo(Module, {
  foreignKey: "required_id",
  as: "required"
})

Module.hasMany(Topic, {
  foreignKey: "module_id"
});


let module_includes = [{
  model: Prerequisite, include: [{
    model: PrerequisiteOr,
    as: "or",
    include: [{
      model: PrerequisiteMultipleOr,
      as: "and",
      include: [{
        model: Module,
      }]
    }]
  }, {
    model: Module,
    as: "required",
  }]
}, {
  model: Topic
}];

Module.crudspec.list_includes = module_includes;

Module.crudspec.detail_includes = module_includes;