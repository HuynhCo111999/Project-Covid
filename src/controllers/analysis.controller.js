const db = require('../models');
const treatmentLocation = db.treatmentLocation;
const HistoryStatus = require("../models/index").history_user_status;
const sequelize = db.sequelize;

const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');

exports.index = async (req, res) => {
    var date = new Date().toISOString();
    console.log(date);
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
            WHERE "histoty_user_status"."createdAt" < '2022-01-18 15:17:03.627 +00:00'
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`
            , { type: QueryTypes.SELECT });
        console.log(users);
    } catch (error) {
        console.log(error);
    }
    
}
