module.exports = (sequelize, Sequelize) => {
  const NecessityOfCombo = sequelize.define("covid-necessities-of-combo", {
    id_necessity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_combo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    min_limit: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    max_limit: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });

  return NecessityOfCombo;
};