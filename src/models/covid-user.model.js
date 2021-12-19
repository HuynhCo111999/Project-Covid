module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("covid-users", {
    name: {
      type: Sequelize.STRING,
    },
    identity_card: {
      type: Sequelize.INTEGER,
    },
    yob: {
      type: Sequelize.INTEGER,
    },
    province: {
      type: Sequelize.STRING,
    },
    district: {
      type: Sequelize.STRING,
    },
    ward: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    treatment_place: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
