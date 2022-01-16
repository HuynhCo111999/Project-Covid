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
db.covidNecessity = require("../models/covid-necessity.model")(sequelize, Sequelize);
db.covidNecessityCombo = require("../models/covid-necessity-combo.model")(sequelize, Sequelize);
db.covidNecessityOfCombo = require("../models/covid-necessitiy-of-combo.model")(sequelize, Sequelize);
db.order = require("../models/order.model")(sequelize, Sequelize);
db.orderDetail = require("../models/order-detail.model")(sequelize, Sequelize);


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
});

db.covidNecessity.belongsToMany(db.covidNecessityCombo, {
    through: "covid-necessities-of-combo",
    foreignKey: "id_necessity",
    otherKey: "id_combo",
});
db.covidNecessityCombo.belongsToMany(db.covidNecessity, {
    through: "covid-necessities-of-combo",
    foreignKey: "id_combo",
    otherKey: "id_necessity",
});

db.order.belongsTo(db.user, {
    foreignKey: "userId",
});

db.order.belongsToMany(db.covidNecessityCombo, {
    through: "orderDetails",
    foreignKey: "id_order",
    otherKey: "id_combo",
});
db.covidNecessityCombo.belongsToMany(db.order, {
    through: "orderDetails",
    foreignKey: "id_combo",
    otherKey: "id_order",
});


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;