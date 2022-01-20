const orderDetail = require("../models/index.js").orderDetail;

module.exports = (sequelize, Sequelize) => {
    const OrderDetailNecessity = sequelize.define("order_detail-necessities", {
        id_order: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        id_combo: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        id_necessity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    });

    return OrderDetailNecessity;
};


// const orderDetail = require("../models/index.js").orderDetail;

// module.exports = (sequelize, Sequelize) => {
//     const OrderDetailNecessity = sequelize.define("order_detail-necessities", {
//         id_order: {
//             type: Sequelize.INTEGER,
//             references: {
//                 model: orderDetail,
//                 key: 'id_order',
//             }
//         },
//         id_combo: {
//             type: Sequelize.INTEGER,
//             references: {
//                 model: orderDetail,
//                 key: 'id_combo',
//             }
//         },
//         quantity: {
//             type: Sequelize.INTEGER,
//             allowNull: false,
//         },
//     });

//     return OrderDetailNecessity;
// };