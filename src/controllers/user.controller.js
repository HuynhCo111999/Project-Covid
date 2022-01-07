const db = require('../models');
const User = db.user;
const covidUser = require("../models/index").covidUser;
const user = require("../models/index").user;
const bcrypt = require('bcryptjs');

exports.getModerators = async (req, res) => {
  const  listUsers = await User.findAll({ raw: true });
  let filterUsers = [];
  await listUsers.map(item => {
    User.findOne({
      where: {
        id: item.id
      }
    }).then((user) => {
      user.getRoles().then(roles => {
        console.log(roles[0].name)
        if(roles[0].name === 'moderator') {
          let temp = {...item, role: roles[0].name}
          filterUsers.push(temp)
        }
      })
    })
  })
  // console.log("listUsers: ", listUsers)
  res.render('admin/listUser', {
    layout: 'admin/main',
    listUsers: filterUsers,
  });
}



exports.getIndex = (req, res) => {
    res.render("user/main", {
        layout: "user/main",
    });
};

// /user/personal-information
exports.getPersonalInformation = (req, res) => {
    // if (req.user) {
    //     currentUser = req.user;
    //     currentCovidUser = covidUser.findOne({ where: { identity_card: 123456789}})
    // }
    const currentCovidUser = {
        id: 3,
        name: 'Ken Nguyen',
        identity_card: 123456789,
        yob: 1995,
        province: 'TPHCM',
        district: 'THU DUC',
        ward: 'Ward 3',
        status: 'F0',
        relatedPerson: 'Không có',
        treatment_place: 'SGN',
        createdAt: '2021 - 12 - 21 T14: 23: 40.106 Z',
        updatedAt: '2021 - 12 - 21 T14: 23: 40.106 Z'
    };
    // const users = await covidUser.findAll();
    res.render("user/personal-information", {
        layout: "user/main",
        currentUser: currentCovidUser,
        someData: 'Xem thông tin cá nhân'
    });
};

// user/change-information
exports.getChangeInformation = (req, res) => {
    res.render("user/change-information", {
        layout: "user/main",
        someData: 'Thay đổi thông tin cá nhân'
    });
}

// user/change-information
exports.postChangeInformation = async(req, res) => {
    console.log("req body: ", req.body)
    let inputPwd = req.body.password;
    let inputNewPwd = req.body.newPassword;
    let inputConfirmPwd = req.body.confirmPassword;


    let initPassword = '1234567';
    const pwd = await bcrypt.hash(initPassword, 10);
    const currentUser = {
        username: 'userTest7',
        email: 'userTest3@gmail.com',
        password: pwd,
    }

    await user.create(currentUser)
    let flag = false;
    let errMsg1 = '',
        errMsg2 = '',
        errMsg3 = '';

    const resultChallenge = await bcrypt.compare(inputPwd, currentUser.password);

    if (inputPwd.length < 6) {
        errMsg1 = 'Vui lòng nhập tối thiểu 6 ký tự';
        flag = true;
    } else {
        if (!resultChallenge) {
            errMsg1 = 'Mật khẩu không chính xác';
            flag = true;
        }
    }

    if (inputNewPwd.length < 6) {
        errMsg2 = 'Vui lòng nhập tối thiểu 6 ký tự';
        flag = true;
    }

    if (inputConfirmPwd.length < 6) {
        errMsg3 = 'Vui lòng nhập tối thiểu 6 ký tự';
        flag = true;
    } else {
        if (!inputNewPwd.includes(inputConfirmPwd)) {
            errMsg3 = 'Mật khẩu không khớp';
            flag = true;
        }
    }

    if (flag == true) {
        res.render("user/change-information", {
            layout: "user/main",
            someData: 'Thay đổi thông tin cá nhân',
            errMsg1: errMsg1,
            errMsg2: errMsg2,
            errMsg3: errMsg3,
            value1: inputPwd,
            value2: inputNewPwd,
            value3: inputConfirmPwd,
        });
        return;
    }

    const updatePwd = await bcrypt.hash(inputNewPwd, 10);
    await user.update({
        password: updatePwd,
    }, {
        where: { username: currentUser.username }
    });

    res.redirect('/user');
};


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};
