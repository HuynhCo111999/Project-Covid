module.exports = (sequelize, Sequelize) => {
    const NecessityCombo = sequelize.define("covid-necessity-combos", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sales_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sales_cycle: {                 //null là ngày, false là tuần, true là tháng
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    });
  
    return NecessityCombo;
  };