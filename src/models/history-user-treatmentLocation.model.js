const User = require("../models/index.js").covidUser;
const Location = require("../models/index.js").treatmentLocation;

module.exports = (sequelize, Sequelize) => {
    const HistoryUserLoacation = sequelize.define("histoty_user_location", {
        covidUserId: {
            type: Sequelize.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        treatmentLocationId: {
            type: Sequelize.INTEGER,
            references: {
                model: Location,
                key: 'id'
            }
        },
    });

    return HistoryUserLoacation;
};
