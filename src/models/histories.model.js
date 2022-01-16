module.exports = (sequelize, Sequelize) => {
    const Histores = sequelize.define("histories", {
        status: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Histores;
};