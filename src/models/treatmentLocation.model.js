module.exports = (sequelize, Sequelize) => {
    const TreatmentLocation = sequelize.define("treatmentLocation", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      capacity: {
          type: Sequelize.INTEGER
      },
      current: {
        type: Sequelize.INTEGER
      }
    });
  
    return TreatmentLocation;
  };
  