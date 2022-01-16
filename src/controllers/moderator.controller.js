const covidUser = require("../models/index").covidUser;
const User = require("../models/index").user;
const treatmentLocation = require("../models/index").treatmentLocation;
const StatusCovid = require("../models/index").statusCovidUser;
const HistoryStatus = require("../models/index").history_user_status;
const HistoryLocation = require("../models/index").history_user_location;
const Sequelize = require("sequelize");


const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

exports.getIndex = async (req, res) => {
  const users = await covidUser.findAll({
    include: [{
      model: HistoryStatus,
      include: [{
        model: StatusCovid,
        attributes: ['status'],
      }],
    },{
      model: HistoryLocation,
      include: [{
        model: treatmentLocation,
        attributes: ['name'],
      }],
    }],
    order: [
      [ HistoryStatus, 'id', 'ASC' ],
      [ HistoryLocation, 'id', 'ASC' ],
    ],
    nest: true,
  });
  const obj= JSON.parse(JSON.stringify(users))
  // console.log(obj[0]);
  res.render("moderator/main", {
    layout: "moderator/main",
    function: "list",
    users: obj,
  });
};

exports.getAddUser = async (req, res) => {
  const users = await covidUser.findAll({
    order: [['id', 'ASC']],
    raw: true,
  });
  const location = await treatmentLocation.findAll({
    where: {
      current: {
        [Op.lt]: Sequelize.col('capacity'),
      }
    },
    order: [['id', 'ASC']],
    raw: true,
  });
  const statusCovid = await StatusCovid.findAll({
    raw: true,
  });

  res.render("moderator/add-user", {
    layout: "moderator/main",
    related_persons: users,
    location: location,
    statusCovid: statusCovid,
    function: "add-user",
  });
};

exports.postAddUser = async (req, res) => {
  const errors = validationResult(req);
  const users = await covidUser.findAll({
    raw: true,
  });
  const location = await treatmentLocation.findAll({
    where: {
      current: {
        [Op.lt]: Sequelize.col('capacity'),
      }
    },
    order: [['id', 'ASC']],
    raw: true,
  });
  const statusCovid = await StatusCovid.findAll({
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
      statusCovid: statusCovid,
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
};

  covidUser
    .create({
      name: req.body.name,
      identity_card: req.body.card,
      yob: req.body.yob,
      province: req.body.province,
      district: req.body.district,
      ward: req.body.ward,
      related_person: req.body.related_person,
    })
    .then(async (result) => {
      try {
        await HistoryStatus.create({
          covidUserId: result.id,
          statusCovidUserId: req.body.status,
        });
      } catch (error) {
        console.log(error);
      }
      try {
        await HistoryLocation.create({
          covidUserId: result.id,
          treatmentLocationId: req.body.place,
        });
      } catch (error) {
        console.log(error);
      }
    })
    .then(async() => {
      try {
        await treatmentLocation.increment({current: 1}, { where: { id: parseInt(req.body.place)} }); 
      } catch (error) {
        console.log(error);
      }
    })
    .then(() => {
      return User.create({
        username: req.body.card.toString(),
        password: "12345678",
      });
    })
    .then(async () => {
      const users = await covidUser.findAll({
        raw: true,
    });
    const location = await treatmentLocation.findAll({
        raw: true,
      });
      const statusCovid = await StatusCovid.findAll({
        raw: true,
      });
      return res.render("moderator/add-user", {
        layout: "moderator/main",
        related_persons: users,
        location: location,
        statusCovid: statusCovid,
        successMessage: "Thêm thành công",
        function: "add-user",
    }); 
});

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);

  const user = await covidUser.findByPk(userId, { raw: true });
  const account = await User.findOne({
    username: user.identity_card.toString(),
  });

  covidUser
    .findByPk(userId)
    .then((user) => {
      account.destroy();
      return user.destroy();
    })
    .then(async () => {
      const users = await covidUser.findAll({
        raw: true,
      });
      for (let user of users) {
        if (user.related_person) {
          if (user.related_person.toString().split(".")[0] === userId) {
            const u = await covidUser.findByPk(user.id);
            u.related_person = null;
            u.save();
          }
        }     
      }
      return res.redirect("/moderator");
    })
    .catch((err) => console.log(err));
};
exports.postAddUser = async(req, res) => {
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

  const rs = await covidUser.findByPk(userId, {
    include: [{
      // limit: 1,
      model: HistoryStatus,
      include: [{
        model: StatusCovid,
        attributes: ['status'],
      }],
    },{
      model: HistoryLocation,
      include: [{
        model: treatmentLocation,
        attributes: ['name'],
      }],
    }],
    order: [
      [ HistoryStatus, 'id', 'ASC' ],
      [ HistoryLocation, 'id', 'ASC' ],
    ],
    nest: true,
  });
  const user = JSON.parse(JSON.stringify(rs));
  if (!user) return res.redirect("/moderator");
  const statusId = user.histoty_user_statuses[user.histoty_user_statuses.length - 1].statusCovidUserId;
  const locationId = user.histoty_user_locations[user.histoty_user_locations.length - 1].treatmentLocationId;
  
  let users = await covidUser.findAll({
    raw: true,
  });

    const user = await covidUser.findByPk(userId, { raw: true });
    const account = await User.findOne({
        username: user.identity_card.toString(),
    });

  const location = await treatmentLocation.findAll({
    where: {
      current: {
        [Op.lt]: Sequelize.col('capacity'),
      }
    },
    order: [['id', 'ASC']],
    raw: true,
  });
  const statusCovid = await StatusCovid.findAll({
    where:{
      id: {
        [Op.lte]: statusId,
      }
    },
    raw: true,
  });
  return res.render("moderator/edit-user", {
    layout: "moderator/main",
    userId: userId,
    name: user.name,
    related_persons: users,
    location: location,
    statusCovid: statusCovid,
    card: user.identity_card,
    province: user.province,
    district: user.district,
    ward: user.ward,
    yob: user.yob,
    status: statusId,
    related_person: user.related_person,
    place: locationId,
    function: "list",
  });
};

exports.editUser = async (req, res) => {
  const userId = req.body.userId;
  const rs = await covidUser.findByPk(userId, {
    include: [{
      // limit: 1,
      model: HistoryStatus,
      include: [{
        model: StatusCovid,
        attributes: ['status'],
      }],
    },{
      model: HistoryLocation,
      include: [{
        model: treatmentLocation,
        attributes: ['name'],
      }],
    }],
    order: [
      [ HistoryStatus, 'id', 'ASC' ],
      [ HistoryLocation, 'id', 'ASC' ],
    ],
    nest: true,
  });
  const user = JSON.parse(JSON.stringify(rs));
  const statusId = user.histoty_user_statuses[user.histoty_user_statuses.length - 1].statusCovidUserId;
  const locationId = user.histoty_user_locations[user.histoty_user_locations.length - 1].treatmentLocationId;  

  const errors = validationResult(req);

  let users = await covidUser.findAll({
    raw: true,
  });
  users = users.filter((user) => user.id.toString() !== userId);
  const location = await treatmentLocation.findAll({
    where: {
      current: {
        [Op.lt]: Sequelize.col('capacity'),
      }
    },
    order: [['id', 'ASC']],
    raw: true,
  });
  const statusCovid = await StatusCovid.findAll({
    where:{
      id: {
        [Op.lte]: statusId,
      }
    },
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

    let users = await covidUser.findAll({
        raw: true,
    });

  if (!errors.isEmpty()) {
    return res.status(422).render("moderator/edit-user", {
      layout: "moderator/main",
      errorMessage: errors.array(),
      userId: userId,
      related_persons: users,
      location: location,
      statusCovid: statusCovid,
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
  let isChangeStatus = (statusId != parseInt(req.body.status)) ? true : false;
  let isChangeLocation = (locationId != parseInt(req.body.place)) ? true : false;

  covidUser
    .findByPk(userId)
    .then((user) => {
      user.name = req.body.name;
      user.identity_card = req.body.card;
      user.yob = req.body.yob;
      user.province = req.body.province;
      user.district = req.body.district;
      user.ward = req.body.ward;
      user.related_person = req.body.related_person;
      return user.save();
    })
    .then(async () => {
      // const related_people = await covidUser.findAll({
      //   where: {
      //     related_person: {
      //       [Op.eq]: userId,
      //     }
      //   },
      //   raw: true,
      // });
      // related_people.forEach(async (person) => {
      //   await covidUser.updated({status: '3'},{
      //     where: {
      //       id: person.id,
      //     },
      //   });
      if(isChangeStatus){
        try {
          await HistoryStatus.create({
            covidUserId: userId,
            statusCovidUserId: req.body.status,
          });
        } catch (error) {
          console.log(error);
        }
      }
      if(isChangeLocation) {
        try {
          await HistoryLocation.create({
            covidUserId: userId,
            treatmentLocationId: req.body.place,
          });
          await treatmentLocation.increment({current: 1}, { where: { id: parseInt(req.body.place)} });
          await treatmentLocation.increment({current: -1}, { where: { id: locationId} });
        } catch (error) {
          console.log(error);
        }

      }  
      // });
    })
    .then(async () => {
      const users = await covidUser.findAll({
        include: [{
          // limit: 1,
          model: HistoryStatus,
          include: [{
            model: StatusCovid,
            attributes: ['status'],
          }],
        },{
          model: HistoryLocation,
          include: [{
            model: treatmentLocation,
            attributes: ['name'],
          }],
        }],
        order: [
          [ HistoryStatus, 'id', 'ASC' ],
          [ HistoryLocation, 'id', 'ASC' ],
        ],
        nest: true,
      });
      const obj= JSON.parse(JSON.stringify(users))
      res.render("moderator/main", {
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
        users: obj,
        successMessage: "Sửa thành công",
      });
    })
    .catch((err) => console.log(err));
};

exports.editUser = async(req, res) => {
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
    .then(async() => {
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
    .catch((err) => console.log(err))
}