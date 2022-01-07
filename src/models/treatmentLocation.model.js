module.exports = (sequelize, Sequelize) => {
    const TreatmentLocation = sequelize.define("treatmentLocation", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      capacity: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      current: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  
    return TreatmentLocation;
  };
  