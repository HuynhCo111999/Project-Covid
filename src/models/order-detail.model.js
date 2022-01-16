module.exports = (sequelize, Sequelize) => {
    const orderDetail = sequelize.define("orderDetails", {
        description: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    });

    return orderDetail;
};