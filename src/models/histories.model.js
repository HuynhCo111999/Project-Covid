module.exports = (sequelize, Sequelize) => {
    const Histores = sequelize.define("histories", {
      histores: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      }
    });
  
    return Histores;
  };
  