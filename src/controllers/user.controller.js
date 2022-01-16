const db = require('../models');
const User = db.user;
const covidUser = require("../models/index").covidUser;
const covidNecessityCombo = require("../models/index").covidNecessityCombo;
const covidNecessityOfCombo = require("../models/index").covidNecessityOfCombo;
const covidNecessity = require("../models/index").covidNecessity;
const order = require("../models/index").order;
const orderDetail = require("../models/index").orderDetail;

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
  return res.render('admin/listUser', {
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
    req.user = {
        id: 3,
        name: 'Ken Nguyen',
        identity_card: 123456789,
        yob: 1995,
        province: 'TPHCM',
        district: 'THU DUC',
        ward: 'Ward 3',
        status: 'F0',
        relatedPerson: 'Không có',
        treatment_place: 'Khu cách li Quận 9',
        createdAt: '2021 - 12 - 21 T14: 23: 40.106 Z',
        updatedAt: '2021 - 12 - 21 T14: 23: 40.106 Z'
    };

    console.log("req user2: ", req.user)

    return res.render("user/personal-information", {
        layout: "user/main",
        function: "personal-information",
        currentUser: req.user,
        someData: 'Xem thông tin cá nhân',
        someData2: 'Các thông tin cơ bản',
    });
};

exports.getChangeInformation = (req, res) => {
    return res.render("user/change-information", {
        layout: "user/main",
        function: "change-information",
        someData: 'Thay đổi thông tin cá nhân',
    });
}

exports.postChangeInformation = async(req, res) => {
    console.log("req body: ", req.body)
    let inputPwd = req.body.password;
    let inputNewPwd = req.body.newPassword;
    let inputConfirmPwd = req.body.confirmPassword;


    let initPassword = '123456';
    const pwd = await bcrypt.hash(initPassword, 10);
    const currentUser = {
        username: 'userTest1',
        email: 'userTest1@gmail.com',
        password: pwd,
    }

    await user.create(currentUser);

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

exports.getBuyNecessityCombo = async(req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const necessityOfCombos = await covidNecessityOfCombo.findAll({
        raw: true,
    });

    const covidNecessities = await covidNecessity.findAll({
        raw: true,
    });

    const covidNecessityCombos = await covidNecessityCombo.findAll({
        raw: true,
    });


    let dataNeccessityCombo = [];
    for (let necessityOfCombo of necessityOfCombos) {

        let tempNecessityCombo = {};
        for (let covidNecessityCombo of covidNecessityCombos) {
            if (necessityOfCombo.id_combo == covidNecessityCombo.id) {
                tempNecessityCombo = covidNecessityCombo;
                break;
            }
        }

        let tempNecessity = {};
        for (let covidNecessity of covidNecessities) {
            if (necessityOfCombo.id_necessity == covidNecessity.id) {
                tempNecessity = covidNecessity;
                break;
            }
        }

        let flag = -1;
        for (let i = 0; i < dataNeccessityCombo.length; i++) {
            if (dataNeccessityCombo[i].id == tempNecessityCombo.id) {
                flag = i;
                break;
            }
        }

        if (flag == -1) {
            dataNeccessityCombo.push({
                id: tempNecessityCombo.id,
                name: tempNecessityCombo.name,
                sales_limit: tempNecessityCombo.sales_limit,
                sales_cycle: tempNecessityCombo.sales_cycle,
                quantity: 1,
                price: necessityOfCombo.min_limit * tempNecessity.price,
                amount: necessityOfCombo.min_limit * tempNecessity.price,
                necessities: [{
                    id_necessity: tempNecessity.id,
                    name_necessity: tempNecessity.name,
                    price_necessity: tempNecessity.price,
                    unit_of_measurement: tempNecessity.unit_of_measurement,
                    min_limit: necessityOfCombo.min_limit,
                    max_limit: necessityOfCombo.max_limit,
                }]
            })
        } else {
            dataNeccessityCombo[flag].necessities.push({
                id_necessity: tempNecessity.id,
                name_necessity: tempNecessity.name,
                price_necessity: tempNecessity.price,
                unit_of_measurement: tempNecessity.unit_of_measurement,
                min_limit: necessityOfCombo.min_limit,
                max_limit: necessityOfCombo.max_limit,
            });
            dataNeccessityCombo[flag].price += necessityOfCombo.min_limit * tempNecessity.price;
            dataNeccessityCombo[flag].amount = dataNeccessityCombo[flag].price;
        }
    }

    return res.render("user/necessities-management", {
        layout: "user/main",
        necessityCombos: dataNeccessityCombo,
        function: "buy-necessity-combo",
        someData: 'Mua gói nhu yếu phẩm',
    });
};


exports.getCart = async(req, res) => {

    console.log("\n\n\nGET CART req.session.cart: \n", req.session.cart);
    // let initPassword = '123456';
    // const pwd = await bcrypt.hash(initPassword, 10);
    // const currentUser = {
    //     username: 'userTest11',
    //     email: 'userTest@gmail.com',
    //     password: pwd,
    // }

    // await user.create(currentUser);

    if (!req.session.cart || req.session.cart.length == 0) {
        return res.render("user/cart", {
            layout: "user/main",
            carts: req.session.cart,
            function: "buy-necessity-combo",
            someData: "Mua gói nhu yếu phẩm",
            someData2: "Giỏ hàng",
            failureMessage2: "Không có gói nhu yếu phẩm nào trong giỏ hàng",
        });
    } else {
        let totalAmount = 0;
        for (let cart of req.session.cart) {
            totalAmount += cart.amount;
        }

        return res.render("user/cart", {
            layout: "user/main",
            carts: req.session.cart,
            function: "buy-necessity-combo",
            someData: "Mua gói nhu yếu phẩm",
            someData2: "Giỏ hàng",
            totalAmount: totalAmount,
        });
    }
};

exports.postAddCart = async(req, res) => {
    let carts = req.session.cart;
    let idCombo = parseInt(req.body.dataHide2);
    for (let cart of carts) {
        if (cart.idCombo === idCombo) {
            return res.render("user/cart", {
                layout: "user/main",
                carts: req.session.cart,
                function: "buy-necessity-combo",
                someData: "Mua gói nhu yếu phẩm",
                someData2: "Giỏ hàng",
                failureMessage: "Gói nhu yếu phẩm này đã có trong giỏ hàng",
            });
        }
    }

    const currentNecessityCombo = await covidNecessityCombo.findOne({
        where: { id: idCombo },
        raw: true,
    });

    let necessities = [];
    for (let i = 0; i < req.body.dataHide.length; i++) {
        let data = req.body.dataHide[i].split('-');
        const currentNecessity = await covidNecessity.findOne({
            where: { id: parseInt(data[0]) },
            raw: true,
        });
        necessities.push({
            idNecessity: parseInt(data[0]),
            name_necessity: currentNecessity.name,
            price_necessity: parseInt(data[1]),
            quantity_necessity: parseInt(req.body.currentInput[i]),
            unit_of_measurement: currentNecessity.unit_of_measurement,
        });
    }

    let descriptionArray = []
    let priceCombo = 0;
    for (let i = 0; i < necessities.length; i++) {
        priceCombo += necessities[i].price_necessity * necessities[i].quantity_necessity;
        descriptionArray.push(`${i + 1}. ${necessities[i].quantity_necessity} ${necessities[i].unit_of_measurement} ${necessities[i].name_necessity} (${necessities[i].price_necessity}đ/${necessities[i].unit_of_measurement})`);
    }

    const necessityCombo = {
        idCombo: currentNecessityCombo.id,
        name: currentNecessityCombo.name,
        sales_limit: currentNecessityCombo.sales_limit,
        sales_cycle: currentNecessityCombo.sales_cycle,
        quantity: 1,
        description: descriptionArray.join("\n"),
        price: priceCombo,
        amount: priceCombo * 1,
        necessities: necessities,
    };

    req.session.cart = [...req.session.cart, necessityCombo];
    let totalAmount = 0;
    for (let cart of req.session.cart) {
        totalAmount += cart.amount;
    }

    return res.render("user/cart", {
        layout: "user/main",
        carts: req.session.cart,
        function: "buy-necessity-combo",
        someData: 'Mua gói nhu yếu phẩm',
        someData2: 'Giỏ hàng',
        totalAmount: totalAmount,
    });
};

exports.deleteCart = async(req, res) => {
    let idCombo = parseInt(req.params.id);
    if (!req.session.cart || req.session.cart.length == 0) {
        return res.render("user/cart", {
            layout: "user/main",
            carts: req.session.cart,
            function: "buy-necessity-combo",
            someData: "Mua gói nhu yếu phẩm",
            someData2: "Giỏ hàng",
            failureMessage2: "Không có gói nhu yếu phẩm nào trong giỏ hàng để xóa",
        });
    } else {
        let indexDelete = -1;
        for (let i = 0; i < req.session.cart.length; i++) {
            if (req.session.cart[i].idCombo == idCombo) {
                indexDelete = i;
                break;
            }
        }

        req.session.cart.splice(indexDelete, 1);
        let totalAmount = 0;
        for (let cart of req.session.cart) {
            totalAmount += cart.amount;
        }

        if (req.session.cart.length == 0) {
            return res.render("user/cart", {
                layout: "user/main",
                carts: req.session.cart,
                function: "buy-necessity-combo",
                someData: "Mua gói nhu yếu phẩm",
                someData2: "Giỏ hàng",
                failureMessage2: "Không có gói nhu yếu phẩm nào trong giỏ hàng",
            });
        }
        return res.render("user/cart", {
            layout: "user/main",
            carts: req.session.cart,
            function: "buy-necessity-combo",
            someData: "Mua gói nhu yếu phẩm",
            someData2: "Giỏ hàng",
            totalAmount: totalAmount,
        });
    }
};

exports.postOrderNecessityCombo = async(req, res) => {
    console.log("\n\nVO HAM ORDER");

    let keys = Object.keys(req.body);
    let values = Object.values(req.body);
    let idCombos = [];
    let quantityCombos = [];
    for (let i = 0; i < keys.length; i++) {
        let dataSplit = keys[i].split('-');
        idCombos.push(parseInt(dataSplit[1]));
        quantityCombos.push(parseInt(values[i]));
    }

    for (let i = 0; i < req.session.cart.length; i++) {
        for (let j = 0; j < idCombos.length; j++) {
            if (req.session.cart[i].idCombo == idCombos[j]) {
                req.session.cart[i].quantity = quantityCombos[j];
                req.session.cart[i].amount = req.session.cart[i].quantity * req.session.cart[i].price;
            }
        }
    }

    const necessityOfCombos = await covidNecessityOfCombo.findAll({
        raw: true,
    });
    const covidNecessities = await covidNecessity.findAll({
        raw: true,
    });
    const covidNecessityCombos = await covidNecessityCombo.findAll({
        raw: true,
    });


    let dataNeccessityCombo = [];
    for (let necessityOfCombo of necessityOfCombos) {
        let tempNecessityCombo = {};
        for (let covidNecessityCombo of covidNecessityCombos) {
            if (necessityOfCombo.id_combo == covidNecessityCombo.id) {
                tempNecessityCombo = covidNecessityCombo;
                break;
            }
        }

        let tempNecessity = {};
        for (let covidNecessity of covidNecessities) {
            if (necessityOfCombo.id_necessity == covidNecessity.id) {
                tempNecessity = covidNecessity;
                break;
            }
        }

        let flag = -1;
        for (let i = 0; i < dataNeccessityCombo.length; i++) {
            if (dataNeccessityCombo[i].id == tempNecessityCombo.id) {
                flag = i;
                break;
            }
        }

        if (flag == -1) {
            dataNeccessityCombo.push({
                id: tempNecessityCombo.id,
                name: tempNecessityCombo.name,
                sales_limit: tempNecessityCombo.sales_limit,
                sales_cycle: tempNecessityCombo.sales_cycle,
                quantity: 1,
                price: necessityOfCombo.min_limit * tempNecessity.price,
                amount: necessityOfCombo.min_limit * tempNecessity.price,
                necessities: [{
                    id_necessity: tempNecessity.id,
                    name_necessity: tempNecessity.name,
                    price_necessity: tempNecessity.price,
                    unit_of_measurement: tempNecessity.unit_of_measurement,
                    min_limit: necessityOfCombo.min_limit,
                    max_limit: necessityOfCombo.max_limit,
                }]
            })
        } else {
            dataNeccessityCombo[flag].necessities.push({
                id_necessity: tempNecessity.id,
                name_necessity: tempNecessity.name,
                price_necessity: tempNecessity.price,
                unit_of_measurement: tempNecessity.unit_of_measurement,
                min_limit: necessityOfCombo.min_limit,
                max_limit: necessityOfCombo.max_limit,
            });
            dataNeccessityCombo[flag].price += necessityOfCombo.min_limit * tempNecessity.price;
            dataNeccessityCombo[flag].amount = dataNeccessityCombo[flag].price;
        }
    }


    let idUserDemo = 27;
    const userDemo = await user.findOne({
        where: { id: idUserDemo },
        raw: true,
    });

    // Tìm thông tin chi tiết của 1 user
    // const covidUserDemo = await covidUser.findOne({
    //     where: { identity_card: parseInt(userDemo.username) },
    //     raw: true,
    // });

    let totalAmount = 0;
    for (let cart of req.session.cart) {
        totalAmount += cart.amount;
    }

    const orders = await order.findAll({
        where: { userId: idUserDemo },
        raw: true,
    });
    console.log("orders: ", orders);

    if (orders.length <= 0) {
        console.log("\n\n---nguoi dung chua co don hang");
        let orderAdd = await order.create({
            userId: idUserDemo,
            totalAmount: totalAmount,
            status: false,
        });
        for (let i = 0; i < req.session.cart.length; i++) {
            await orderDetail.create({
                id_order: orderAdd.dataValues.id,
                id_combo: req.session.cart[i].idCombo,
                description: req.session.cart[i].description,
                price: req.session.cart[i].price,
                quantity: req.session.cart[i].quantity,
                amount: req.session.cart[i].amount,
            });
        }
        req.session.cart = [];
        return res.render("user/necessities-management", {
            layout: "user/main",
            necessityCombos: dataNeccessityCombo,
            function: "buy-necessity-combo",
            someData: 'Mua gói nhu yếu phẩm',
            successMessage: "Đặt hàng thành công",
        });
    } else {
        console.log("\n\n----nguoi dung da co don hang");
        let quantityRemain = [];
        var now = new Date();
        let current_day = now.getDay();
        let current_month = now.getMonth();
        let current_year = now.getFullYear();
        let current_Date = now.getDate();
        let currentDay = new Date(current_year, current_month, current_Date);
        let currentMonth = new Date(current_year, current_month, 1);
        let startDate;

        if (current_day == 0) {
            startDate = current_Date - 6;
        } else {
            let deltaDay = current_day - 1;
            startDate = current_Date - deltaDay;
        }

        let currentWeek = new Date(current_year, current_month, startDate);
        let currentDate;
        for (let i = 0; i < req.session.cart.length; i++) {

            let quantityCombo = req.session.cart[i].sales_limit;
            let dayDivide;
            if (req.session.cart[i].sales_cycle === null) { // theo ngày
                currentDate = currentDay;
                dayDivide = 1;
            } else if (req.session.cart[i].sales_cycle === false) { // theo tuần
                currentDate = currentWeek;
                dayDivide = 7;
            } else if (req.session.cart[i].sales_cycle === true) { // theo tháng
                currentDate = currentMonth;
                dayDivide = 30;
            }
            for (let j = 0; j < orders.length; j++) {
                let DateCreated = orders[j].createdAt;
                let Difference_In_Time = DateCreated.getTime() - currentDate.getTime();

                if (Difference_In_Time > 0) {
                    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24 * dayDivide);
                    if (Difference_In_Days < 1) {
                        const orderDetails = await orderDetail.findAll({
                            where: { id_order: orders[j].id },
                            raw: true,
                        });
                        for (let k = 0; k < orderDetails.length; k++) {
                            if (req.session.cart[i].idCombo == orderDetails[k].id_combo) {
                                quantityCombo -= orderDetails[k].quantity;
                            }
                        }
                    }
                }
            }
            quantityRemain.push(quantityCombo);
        }

        let flag = false;
        let quantityRemainSubtract = [];
        let errorMessageArray = []
        for (let i = 0; i < req.session.cart.length; i++) {
            let typeDate = "";
            if (req.session.cart[i].sales_cycle === null) { // theo ngày
                typeDate = "ngày";
            } else if (req.session.cart[i].sales_cycle === false) { // theo tuần
                typeDate = "tuần";
            } else if (req.session.cart[i].sales_cycle === true) { // theo tháng
                typeDate = "tháng";
            }

            quantityRemainSubtract.push(quantityRemain[i] - req.session.cart[i].quantity);
            if (quantityRemain[i] - req.session.cart[i].quantity < 0) {
                let string = `${req.session.cart[i].name} chỉ còn ${quantityRemain[i]} lượt mua trong ${typeDate}`;
                errorMessageArray.push(string);
                flag = true;
            }
        }
        console.log("\n\n*****quantityRemain: ", quantityRemain);
        console.log("quantityRemainSubtract; ", quantityRemainSubtract)

        if (flag === true) {
            return res.render("user/cart", {
                layout: "user/main",
                carts: req.session.cart,
                function: "buy-necessity-combo",
                someData: 'Mua gói nhu yếu phẩm',
                someData2: 'Giỏ hàng',
                totalAmount: totalAmount,
                failureMessageString: errorMessageArray,
            });
        } else {
            let orderAdd = await order.create({
                userId: idUserDemo,
                totalAmount: totalAmount,
                status: false,
            });
            for (let i = 0; i < req.session.cart.length; i++) {
                await orderDetail.create({
                    id_order: orderAdd.dataValues.id,
                    id_combo: req.session.cart[i].idCombo,
                    description: req.session.cart[i].description,
                    price: req.session.cart[i].price,
                    quantity: req.session.cart[i].quantity,
                    amount: req.session.cart[i].amount,
                });
            }

            req.session.cart = [];
            return res.render("user/necessities-management", {
                layout: "user/main",
                necessityCombos: dataNeccessityCombo,
                function: "buy-necessity-combo",
                someData: 'Mua gói nhu yếu phẩm',
                successMessage: "Đặt hàng thành công",
            });
        }

    }
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