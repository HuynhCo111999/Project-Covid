module.exports = (sequelize, Sequelize) => {
  const Necessity = sequelize.define("covid-necessities", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    unit_of_measurement: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image_path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Necessity;
};