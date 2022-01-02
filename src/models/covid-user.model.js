module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("covid-users", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    identity_card: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    yob: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    province: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    district: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ward: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    treatment_place: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return User;
};