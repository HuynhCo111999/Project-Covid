const covidUser = require("../models/index").covidUser;
const User = require("../models/index").user;
const treatmentLocation = require("../models/index").treatmentLocation;
const { validationResult } = require("express-validator");

exports.getIndex = async (req, res) => {
  const users = await covidUser.findAll({
    raw: true,
  });
  res.render("moderator/main", {
    layout: "moderator/main",
    function: "list",
    users: users,
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
    return res.status(422).render("moderator/add-user", {
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

      return res.render("moderator/add-user", {
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

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  covidUser
    .findByPk(userId)
    .then((user) => {
      return user.destroy();
    })
    .then(() => {
      return res.redirect("/moderator");
    })
    .catch((err) => console.log(err));
};

exports.getIndexFromEdit = (req, res) => {
  res.redirect("/moderator");
};

exports.getEditUser = async (req, res) => {
  const userId = req.params.id;

  const user = await covidUser.findByPk(userId, {
    raw: true,
  });

  if (!user) return res.redirect("/moderator");

  const users = await covidUser.findAll({
    raw: true,
  });
  const location = await treatmentLocation.findAll({
    raw: true,
  });

  return res.render("moderator/edit-user", {
    layout: "moderator/main",
    userId: userId,
    name: user.name,
    related_persons: users,
    location: location,
    card: user.identity_card,
    province: user.province,
    district: user.district,
    ward: user.ward,
    yob: user.yob,
    status: user.status,
    related_person: user.related_person,
    place: user.treatment_place,
    function: "list",
  });
};

exports.editUser = async (req, res) => {
  const userId = req.body.userId;
  const errors = validationResult(req);

  const users = await covidUser.findAll({
    raw: true,
  });
  const location = await treatmentLocation.findAll({
    raw: true,
  });

  let hasUser = false;
  for (let user of users) {
    if (
      req.body.card === user.identity_card.toString() &&
      user.id.toString() !== userId
    )
      hasUser = true;
  }

  if (hasUser) {
    errors.errors.push({
      value: req.body.card,
      msg: "CMND/CCCD đã tồn tại",
      param: "card",
      location: "body",
    });
  }

  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(422).render("moderator/edit-user", {
      layout: "moderator/main",
      errorMessage: errors.array(),
      userId: userId,
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
      function: "list",
    });
  }

  covidUser
    .findByPk(userId)
    .then((user) => {
      user.name = req.body.name;
      user.identity_card = req.body.card;
      user.yob = req.body.yob;
      user.province = req.body.province;
      user.district = req.body.district;
      user.ward = req.body.ward;
      user.status = req.body.status;
      user.related_person = req.body.related_person;
      user.treatment_place = req.body.place;
      return user.save();
    })
    .then(async () => {
      const updated = await covidUser.findAll({
        raw: true,
      });
      res.render("moderator/main", {
        layout: "moderator/main",
        function: "list",
        users: updated,
        successMessage: "Sửa thành công",
      });
    })
    .catch((err) => console.log(err));
};
