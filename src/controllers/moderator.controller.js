const covidUser = require("../models/index").covidUser;
const User = require("../models/index").user;
const treatmentLocation = require("../models/index").treatmentLocation;
const { validationResult } = require("express-validator");

exports.getIndex = (req, res) => {
  res.render("moderator/main", {
    layout: "moderator/main",
    function: "list",
  });
};

exports.getAddUser = async (req, res) => {
  const users = await covidUser.findAll({
    attributes: ["name", "yob", "ward", "district", "province"],
    raw: true,
  });
  const location = await treatmentLocation.findAll({
    raw: true,
  });

  res.render("moderator/add-user", {
    layout: "moderator/main",
    related_persons: users,
    location: location,
    function: "add-user",
  });
};

exports.postAddUser = async (req, res) => {
  const errors = validationResult(req);
  const users = await covidUser.findAll({
    raw: true,
  });
  const location = await treatmentLocation.findAll({
    raw: true,
  });

  let hasUser = false;
  for (let user of users) {
    if (req.body.card === user.identity_card.toString()) hasUser = true;
  }

  if (hasUser) {
    errors.errors.push({
      value: req.body.card,
      msg: "CMND/CCCD đã tồn tại",
      param: "card",
      location: "body",
    });
  }

  if (!errors.isEmpty()) {
    res.status(422).render("moderator/add-user", {
      layout: "moderator/main",
      errorMessage: errors.array(),
      related_persons: users,
      location: location,
      name: req.body.name,
      card: req.body.card,
      yob: req.body.yob,
      province: req.body.province,
      district: req.body.district,
      ward: req.body.ward,
      status: req.body.status,
      related_person: req.body.related_person,
      place: req.body.place,
      function: "add-user",
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
    .then(async () => {
      const users = await covidUser.findAll({
        attributes: ["name", "yob", "ward", "district", "province"],
        raw: true,
      });
      const location = await treatmentLocation.findAll({
        raw: true,
      });

      res.render("moderator/add-user", {
        layout: "moderator/main",
        related_persons: users,
        location: location,
        successMessage: "Thêm thành công",
        function: "add-user",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
