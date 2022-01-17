const User = require("../models/index.js").covidUser;
const Status = require("../models/index.js").statusCovidUser;

module.exports = (sequelize, Sequelize) => {
  const HistoryUserStatus = sequelize.define("histoty_user_status", {
    covidUserId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    statusCovidUserId: {
      type: Sequelize.INTEGER,
      references: {
        model: Status,
        key: "id",
      },
    },
  });

  return HistoryUserStatus;
};
