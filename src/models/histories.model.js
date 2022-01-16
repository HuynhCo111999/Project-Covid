module.exports = (sequelize, Sequelize) => {
    const Histores = sequelize.define("histories", {
<<<<<<< HEAD
      status: {
        type: Sequelize.STRING,
        allowNull: false
      }
=======
        status: {
            type: Sequelize.STRING,
            allowNull: false
        }
>>>>>>> origin/1.4.3
    });

    return Histores;
};