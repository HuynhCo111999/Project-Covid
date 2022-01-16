module.exports = (sequelize, Sequelize) => {
    const order = sequelize.define("orders", {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        totalAmount: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: { // false là đang giao hàng, true là đã giao hàng
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
    });

    return order;
};