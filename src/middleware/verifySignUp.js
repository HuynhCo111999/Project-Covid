const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  console.log("createUser: ", req.body);
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.render('admin/listUser', {
        error:  "Failed! Username is already in use!"
      })
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.render('admin/listUser', {
          error:  "Failed! Email is already in use!"
        })
        return;
      }
      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  req.body.roles = [req.body.roles];
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.render('admin/listUser', {
          error:  "Failed! Role does not exist = " + req.body.roles[i]
        })
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
