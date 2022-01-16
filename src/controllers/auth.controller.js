const db = require("../models");
const config = require("../config/auth.config");
const moment = require('moment');
const User = db.user;
const Role = db.role;
const Histores = db.histories;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// const { format } = require("path/posix");

exports.createUser = (req, res) => {
    // Save User to Database
    User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        })
        .then(user => {
            console.log("roles create: ", req.body.roles);
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.redirect('/admin/users');
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.redirect('/admin/users');
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.deleteUser = async(req, res) => {
    try {
        const id = parseInt(req.query.id);
        await product.destroy({
            where: {
                id: id
            }
        })
        return res.redirect('/admin/users');
    } catch (error) {
        res.send(error);
    }
}

exports.createUserTest = (req, res) => {
    // Save User to Database
    User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        return res.json({
                            success: 1,
                            message: 'User is registered!'
                        })
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    return res.json({
                        success: 1,
                        message: 'User is registered!'
                    })
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signup = (req, res) => {
  req.body.roles = ['admin'];
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            return res.render('login',{
              layout: 'main'
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          return res.render('login',{
            layout: 'main'
          });
        });
      }
    })
    .catch(err => {
      return res.render('register',{
        layout: 'main'
      });
    });
}

exports.signin = (req, res) => {
    console.log("req: ", req.body);
    User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {
            console.log("user: ", user);
            if (!user) {
                // return res.status(404).send({ message: "User Not found." });
                return res.render('login', {
                    error: 'User not found. Please check again!'
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                // return res.status(401).send({
                //   accessToken: null,
                //   message: "Invalid Password!"
                // });
                return res.render('login', {
                    error: 'Password is wrong! Please check again!'
                })
            }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if(roles[i].name.toUpperCase() === "ADMIN") {
            res.cookie("access_token", token);
            res.cookie("userId", user.id);
            res.cookie("role", 'admin');
            return res.redirect('/admin/users');
          }
          else if (roles[i].name.toUpperCase() === "MODERATOR") {
            Histores.create({
              status: 'login',
              userId: user.id
            }).then(() => {
              res.cookie("access_token", token);
              res.cookie("userId", user.id);
              res.cookie("role", 'moderator');
              return res.redirect('/moderator');
            }).catch((error) => {
              console.log(error)
            })
          }
          else {
            res.cookie("access_token", token);
            res.cookie("userId", user.id);
            res.cookie("role", 'user');
            return res.redirect('/user');
          }
        }
        // res.status(200).send({
        //   id: user.id,
        //   username: user.username,
        //   email: user.email,
        //   roles: authorities,
        //   accessToken: token
        // });
      });
    })
    .catch(err => {
      return res.render('login', {
          error: 'User not found. Please check again!'
      });
    });
};

exports.logout = async(req, res) => {
  const role = req.cookies['role'];
  const userId = req.cookies['userId'];
  if(role === "moderator") {
    Histores.create({
      status: 'logout',
      userId: userId
    }).then(() => {
      res.clearCookie("access_token");
      return res.redirect('/');
    }).catch((error) => {
      console.log(error);
    })
  }
  res.clearCookie("access_token");
  return res.redirect('/');
}

exports.getHistory = async(req, res) => {
  const userId = req.query.id;
  console.log("history: ", userId)
  const histores = await Histores.findAll({
    where: {
      userId: userId
    }
  }); 
  const result = await histores.map(item => {
    const time = moment.utc(item.createdAt, 'YYYY-MM-DD HH:mm').local().format('YYYY-MM-DD HH:mm');
    return {
      id: item.id,
      userId: item.userId,
      time: time,
      status: item.status
    };
  })
  res.json(result);
}

exports.checkfirst = async() => {
  let users = await User.findAll();
  console.log("users: ", users);
  if(!users || users.length === 0) return false;
  return true;
    const userId = req.query.id;
    const histores = await Histores.findOne({
        where: {
            userId: userId
        }
    });
    res.json(histores);
}