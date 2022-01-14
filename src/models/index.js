const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.treatmentLocation = require("../models/treatmentLocation.model")(sequelize, Sequelize);
db.histories = require("../models/histories.model")(sequelize, Sequelize);
db.covidUser = require("../models/covid-user.model.js")(sequelize, Sequelize);
db.statusCovidUser = require("../models/status-covid-user.model.js")(sequelize, Sequelize);



db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});
db.histories.belongsTo(db.user, {
  through: "histories_user",
  foreignKey: "userId",
})
db.covidUser.belongsToMany(db.statusCovidUser,{
  through: "history_user_status",
});
db.statusCovidUser.belongsToMany(db.covidUser, {
  through: "history_user_status",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
