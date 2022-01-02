const covidUser = require("../models/index").covidUser;
const User = require("../models/index").user;
const { validationResult } = require("express-validator");

exports.getIndex = (req, res) => {
    res.render("moderator/main", { layout: "moderator/main" });
};

exports.getAddUser = (req, res) => {
  covidUser
    .findAll({
      attributes: ["name", "yob", "ward", "district", "province"],
      raw: true,
    })
    .then((users) => {
      res.render("moderator/add-user", {
        layout: "moderator/main",
        related_persons: users,
      });
    });
};

exports.postAddUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return covidUser
      .findAll({
        attributes: ["name", "yob", "ward", "district", "province"],
        raw: true,
      })
      .then((users) => {
        res.status(422).render("moderator/add-user", {
          layout: "moderator/main",
          errorMessage: errors.array(),
          related_persons: users,
          name: req.body.name,
          card: req.body.card,
          yob: req.body.yob,
          province: req.body.province,
          district: req.body.district,
          ward: req.body.ward,
          status: req.body.status,
          related_person: req.body.related_person,
          place: req.body.place,
        });
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
      related_person: req.body.related_person,
      treatment_place: req.body.place,
    })
    .then(() => {
      return User.create({
        username: req.body.card.toString(),
        password: "12345678",
      });
    })
    .then(() => {
      covidUser
        .findAll({
          attributes: ["name", "yob", "ward", "district", "province"],
          raw: true,
        })
        .then((users) => {
          res.render("moderator/add-user", {
            layout: "moderator/main",
            related_persons: users,
            successMessage: "Thêm thành công",
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
