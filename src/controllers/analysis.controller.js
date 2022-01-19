const db = require('../models');
const treatmentLocation = db.treatmentLocation;
const HistoryStatus = require("../models/index").history_user_status;
const sequelize = db.sequelize;

const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');

exports.index = async (req, res) => {
    var date = new Date().toISOString();
    try {
        // const rs = await HistoryStatus.findAll({
        //     attributes: [[sequelize.fn('DISTINCT', sequelize.col('covidUserId')), 'alias_name'],'statusCovidUserId','createdAt'],
        //     where: {
        //         createdAt: {
        //             [Op.lt]: date,
        //         }
        //     },
        //     group: ['covidUserId','createdAt'],
        //     raw: true
        // });
        // console.log(rs);
        const users = await sequelize.query(
            `SELECT DISTINCT on ("covidUserId") "covidUserId","statusCovidUserId", "createdAt"
            FROM "histoty_user_statuses" AS "histoty_user_status" 
            WHERE "histoty_user_status"."createdAt" < '${date}'
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`
            , { type: QueryTypes.SELECT });
    } catch (error) {
        console.log(error);
    }
    res.render("moderator/analysis", {
        layout: "moderator/main",
        function: "information-statistics",

    });
}
exports.getAmountByTime = async (req, res) => {
    console.log(req.body.date);
    var date = new Date(req.body.date);
    date.setDate(date.getDate()+1);
    var dateString = date.toISOString();
    // date = date.toISOString();
    // console.log(date);
    var users;
    try {
        users = await sequelize.query(
            `SELECT DISTINCT on ("covidUserId") "covidUserId","statusCovidUserId", "createdAt"
            FROM "histoty_user_statuses" AS "histoty_user_status" 
            WHERE "histoty_user_status"."createdAt" < '${dateString}'
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`
            , { type: QueryTypes.SELECT });
        console.log(users);
    } catch (error) {
        console.log(error);
    }
    var rs = {
        f0: 0,
        f1: 0,
        f2: 0,
        f3: 0,
        Khoi: 0,
    };
    users.forEach(user => {
        switch (user.statusCovidUserId) {
            case 1:
                rs.Khoi++;
                break;
            case 2:
                rs.f0++;
                break;
            case 3:
                rs.f1++;
                break;
            case 4:
                rs.f2++;
                break;
            case 5:
                rs.f3++;
                break;
            default:
                break;
        }
    });
    res.send({rs});
}