module.exports = (sequelize, Sequelize) => {
    const StatusCovid = sequelize.define("statusCovidUser", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      note: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
    });
  
    return StatusCovid;
  };
  