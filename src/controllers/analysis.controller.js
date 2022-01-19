const db = require('../models');
const treatmentLocation = db.treatmentLocation;
const HistoryStatus = require("../models/index").history_user_status;
const sequelize = db.sequelize;

const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');

exports.index = async (req, res) => {
    var date = new Date().toISOString();
    var users;
    try {
        users = await sequelize.query(
            `SELECT DISTINCT on ("covidUserId") "covidUserId","statusCovidUserId", "createdAt"
            FROM "histoty_user_statuses" AS "histoty_user_status" 
            WHERE "histoty_user_status"."createdAt" < '${date}'
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`
            , { type: QueryTypes.SELECT });
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
    var date2 = new Date();
    date2.setUTCHours(0,0,0,0);
    var text2 = date2.toISOString();
    var numberKhoi = await getNumberByStatusToday(text2,1);
    var numberF0 = await getNumberByStatusToday(text2,2);
    var numberF1 = await getNumberByStatusToday(text2,3);
    var sumKhoi = await getSumStatus(1);


    res.render("moderator/analysis", {
        layout: "moderator/main",
        function: "information-statistics",
        rs: rs,
        numberF0: numberF0,
        numberF1: numberF1,
        numberKhoi: numberKhoi,
        sumKhoi: sumKhoi,
    });
}
exports.getAmountByTime = async (req, res) => {
    console.log(req.body.date);
    var date = new Date(req.body.date);
    date.setHours(23);
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
        Khoi: 0,
        f0: 0,
        f1: 0,
        f2: 0,
        f3: 0,
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
const getNumberByStatusToday = async (date, statusid) => {
    try {
        const row = await sequelize.query(
            `SELECT DISTINCT on ("covidUserId") "covidUserId","statusCovidUserId", "createdAt"
            FROM "histoty_user_statuses" AS "histoty_user_status" 
            WHERE "histoty_user_status"."createdAt" > '${date}' and "statusCovidUserId" = ${statusid}
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`
            , { type: QueryTypes.SELECT });
        return row.length;
    } catch (error) {
        console.log(error);
    }
    return 0;
}
const getSumStatus = async (statusid) => {
    try {
        const row = await sequelize.query(
            `SELECT DISTINCT on ("covidUserId") "covidUserId","statusCovidUserId", "createdAt"
            FROM "histoty_user_statuses" AS "histoty_user_status" 
            WHERE "statusCovidUserId" = ${statusid}
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`
            , { type: QueryTypes.SELECT });
        return row.length;
    } catch (error) {
        console.log(error);
    }
    return 0;
}