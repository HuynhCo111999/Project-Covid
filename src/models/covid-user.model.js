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
    related_person: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
