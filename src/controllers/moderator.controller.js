const covidUser = require("../models/index").covidUser;
const User = require("../models/index").user;
const { validationResult } = require("express-validator/check");

exports.getIndex = (req, res) => {
  res.render("moderator/main", { layout: "moderator/main" });
};

exports.getAddUser = (req, res) => {
  res.render("moderator/add-user", {
    layout: "moderator/main",
  });
};

exports.postAddUser = (req, res) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(422).render("moderator/add-user", {
      layout: "moderator/main",
      errorMessage: errors.array(),
      name: req.body.name,
      card: req.body.card,
      yob: req.body.yob,
      province: req.body.province,
      district: req.body.district,
      ward: req.body.ward,
      status: req.body.status,
      place: req.body.place,
    });
  }

  covidUser
    .create({
      name: req.body.name,
      identity_card: req.body.card,
      yob: req.body.yob,
      province: req.body.province,
      district: req.body.district,
      ward: req.body.ward,
      status: req.body.status,
      treatment_place: req.body.place,
    })
    .then(() => {
      return User.create({
        username: req.body.card.toString(),
        password: "12345678",
      });
    })
    .then(() => {
      res.render("moderator/add-user", {
        layout: "moderator/main",
        successMessage: "Thêm thành công",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
