const covidUser = require("../models/index").covidUser;

exports.getIndex = (req, res) => {
    res.render("moderator/main", { layout: "moderator/main" });
};

exports.getAddUser = async(req, res) => {
    const users = await covidUser.findOne({
        where: {
            yob: 2001
        }
    });
    // const users2 = await covidUser.update({ name: "Huynh Van Long new" }, {
    //     where: {
    //         id: 2
    //     }
    // });

    console.log('users: ', users)
    console.log('data value: ', users.dataValues)
    console.log('req user: ', req.user)
        // console.log('users2: ', users2)

    res.render("moderator/add-user", { layout: "moderator/main" });
};

exports.postAddUser = (req, res) => {
    console.log("req body: ", req.body);
    console.log('req user: ', req.user)

    console.log(req.body.ward);

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
            return res.redirect("/moderator");
        })
        .catch((err) => {
            console.log(err);
        });
};