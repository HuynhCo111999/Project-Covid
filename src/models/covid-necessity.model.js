module.exports = (sequelize, Sequelize) => {
    const Necessity = sequelize.define("covid-necessities", {
      name: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.STRING,
      },
      unit_of_measurement: {
        type: Sequelize.STRING,
      },
    });
  
    return Necessity;
  };