const db = require("../models");
const treatmentLocation = db.treatmentLocation;
const HistoryStatus = require("../models/index").history_user_status;
const covidNecessityCombo = db.covidNecessityCombo;
const covidNecessity = db.covidNecessity;
const covidUser = db.covidUser;
const sequelize = db.sequelize;

const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");

exports.index = async (req, res) => {
  var date = new Date().toISOString();
  var users;
  try {
    users = await sequelize.query(
      `SELECT DISTINCT on ("covidUserId") "covidUserId","statusCovidUserId", "createdAt"
            FROM "histoty_user_statuses" AS "histoty_user_status" 
            WHERE "histoty_user_status"."createdAt" < '${date}'
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`,
      { type: QueryTypes.SELECT }
    );
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
  users.forEach((user) => {
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
  date2.setHours(0);
  date2.setMinutes(0);
  date2.setSeconds(0);
  date2.setMilliseconds(0);
  var text2 = date2.toISOString();

  var arrISOString = [text2];
  var arrDateString = [date2.toLocaleDateString("en-GB")];
  for (let i = 1; i < 7; i++) {
    var temp = new Date(date2);
    temp.setDate(date2.getDate() - i);
    arrISOString.push(temp.toISOString());
    arrDateString.push(temp.toLocaleDateString("en-GB"));
  }
  //get thong ke so lieu
  var numberKhoi = await getNumberByStatusToday(text2, 1);
  var numberF0 = await getNumberByStatusToday(text2, 2);
  var numberF1 = await getNumberByStatusToday(text2, 3);
  var sumKhoi = await getSumStatus(1);

  //Get thong tin combo theo ngay
  var a = await getNumberComboByTime(text2, date, -1);
  var arrSumCombo = [a];
  for (let i = 0; i < 6; i++) {
    var temp = await getNumberComboByTime(
      arrISOString[i + 1],
      arrISOString[i],
      -1
    );
    arrSumCombo.push(temp);
  }

  //Get thong tin necessity theo ngay
  var b = await getNumberNecessityByTime(text2, date, -1);
  var arrSumNecessity = [b];
  for (let i = 0; i < 6; i++) {
    var temp = await getNumberNecessityByTime(
      arrISOString[i + 1],
      arrISOString[i],
      -1
    );
    arrSumNecessity.push(temp);
  }
  //get Du no theo ngay
  var payment = await getPayment();

  //get Combo
  const combo = await covidNecessityCombo.findAll({
    raw: true,
  });
  //get Necessity
  const necessity = await covidNecessity.findAll({
    raw: true,
  });

  res.render("moderator/analysis", {
    layout: "moderator/main",
    function: "information-statistics",
    rs: rs,
    numberF0: numberF0,
    numberF1: numberF1,
    numberKhoi: numberKhoi,
    sumKhoi: sumKhoi,
    arrDateString: arrDateString,
    arrSumCombo: arrSumCombo,
    arrSumNecessity: arrSumNecessity,
    payment: payment,
    combo: combo,
    necessity: necessity,
    title: "Thống kê thông tin",
  });
};
exports.getAmountByTime = async (req, res) => {
  var date = new Date(req.body.date);
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  console.log(date);
  var dateString = date.toISOString();
  // console.log(date);
  var users;
  try {
    users = await sequelize.query(
      `SELECT DISTINCT on ("covidUserId") "covidUserId","statusCovidUserId", "createdAt"
            FROM "histoty_user_statuses" AS "histoty_user_status" 
            WHERE "histoty_user_status"."createdAt" < '${dateString}'
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`,
      { type: QueryTypes.SELECT }
    );
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
  users.forEach((user) => {
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
  res.send({ rs });
};
exports.getAmountByCombo = async (req, res) => {
  var comboid = parseInt(req.body.combo);

  var date = new Date().toISOString();
  var date2 = new Date();
  date2.setHours(0);
  date2.setMinutes(0);
  date2.setSeconds(0);
  date2.setMilliseconds(0);
  var text2 = date2.toISOString();

  var arrISOString = [text2];
  for (let i = 1; i < 7; i++) {
    var temp = new Date(date2);
    temp.setDate(date2.getDate() - i);
    arrISOString.push(temp.toISOString());
  }
  //Get thong tin combo theo ngay
  var a = await getNumberComboByTime(text2, date, comboid);
  var arrSumCombo = [a];
  for (let i = 0; i < 6; i++) {
    var temp = await getNumberComboByTime(
      arrISOString[i + 1],
      arrISOString[i],
      comboid
    );
    arrSumCombo.push(temp);
  }
  var revertArray = arrSumCombo.reverse();
  res.send(arrSumCombo);
};

exports.getAmountByNecessity = async (req, res) => {
  var necessityId = parseInt(req.body.necessity);

  var date = new Date().toISOString();
  var date2 = new Date();
  date2.setHours(0);
  date2.setMinutes(0);
  date2.setSeconds(0);
  date2.setMilliseconds(0);
  var text2 = date2.toISOString();

  var arrISOString = [text2];
  for (let i = 1; i < 7; i++) {
    var temp = new Date(date2);
    temp.setDate(date2.getDate() - i);
    arrISOString.push(temp.toISOString());
  }
  //Get thong tin combo theo ngay
  var a = await getNumberNecessityByTime(text2, date, necessityId);
  var arrSumNecessity = [a];
  for (let i = 0; i < 6; i++) {
    var temp = await getNumberNecessityByTime(
      arrISOString[i + 1],
      arrISOString[i],
      necessityId
    );
    arrSumNecessity.push(temp);
  }
  var revertArray = arrSumNecessity.reverse();
  res.send(revertArray);
};



const getNumberByStatusToday = async (date, statusid) => {
  try {
    const row = await sequelize.query(
      `SELECT DISTINCT on ("covidUserId") "covidUserId","statusCovidUserId", "createdAt"
            FROM "histoty_user_statuses" AS "histoty_user_status" 
            WHERE "histoty_user_status"."createdAt" > '${date}' and "statusCovidUserId" = ${statusid}
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`,
      { type: QueryTypes.SELECT }
    );
    return row.length;
  } catch (error) {
    console.log(error);
  }
  return 0;
};
const getSumStatus = async (statusid) => {
  try {
    const row = await sequelize.query(
      `SELECT DISTINCT on ("covidUserId") "covidUserId","statusCovidUserId", "createdAt"
            FROM "histoty_user_statuses" AS "histoty_user_status" 
            WHERE "statusCovidUserId" = ${statusid}
            ORDER BY "covidUserId","statusCovidUserId", "createdAt" DESC;`,
      { type: QueryTypes.SELECT }
    );
    return row.length;
  } catch (error) {
    console.log(error);
  }
  return 0;
};
const getNumberComboByTime = async (start, end, combo) => {
  if (combo == -1) {
    try {
      const row = await sequelize.query(
        `SELECT COALESCE(SUM("quantity"),0) AS "sum"
                FROM "orderDetails"
                WHERE "createdAt" >= '${start}' AND "createdAt" < '${end}'`,
        { type: QueryTypes.SELECT }
      );
      return row[0].sum;
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const row = await sequelize.query(
        `SELECT COALESCE(SUM("quantity"),0) AS "sum"
                FROM "orderDetails" 
                WHERE "id_combo" = ${combo} AND "createdAt" >= '${start}' AND "createdAt" < '${end}'`,
        { type: QueryTypes.SELECT }
      );
      return row[0].sum;
    } catch (error) {
      console.log(error);
    }
  }
  return 0;
};
const getNumberNecessityByTime = async (start, end, necessity) => {
  if (necessity == -1) {
    try {
      const row = await sequelize.query(
        `SELECT COALESCE(SUM("quantity"),0) AS "sum"
                FROM "order_detail-necessities"
                WHERE "createdAt" >= '${start}' AND "createdAt" < '${end}'`,
        { type: QueryTypes.SELECT }
      );
      return row[0].sum;
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const row = await sequelize.query(
        `SELECT COALESCE(SUM("quantity"),0) AS "sum"
                FROM "order_detail-necessities" 
                WHERE "id_necessity" = ${necessity} AND "createdAt" >= '${start}' AND "createdAt" < '${end}'`,
        { type: QueryTypes.SELECT }
      );
      return row[0].sum;
    } catch (error) {
      console.log(error);
    }
  }
  return 0;
};
const getPayment = async () => {
  try {
    const row = await sequelize.query(
      `SELECT COALESCE(SUM("payment"),0) AS "sum"
              FROM "covid-users"`,
      { type: QueryTypes.SELECT }
    );
    return row[0].sum;
  } catch (error) {
    console.log(error);
  }
  return 0;
};