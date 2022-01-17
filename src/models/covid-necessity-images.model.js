module.exports = (sequelize, Sequelize) => {
  const NecessityImages = sequelize.define("covid-necessity-images", {
    id_necessity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    image_path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return NecessityImages;
};