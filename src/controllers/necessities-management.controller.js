const covidNecessity = require("../models/index").covidNecessity;

exports.get = (req, res) => {
    res.render("moderator/necessities-management", { layout: "moderator/main"});
};

exports.add = async (req, res) => {
    try
    {
        await covidNecessity.create({
            name: req.body.name,
            price: req.body.price,
            unit_of_measurement: req.body.unit
        });
        res.redirect('./necessities');
    }
    catch (error)
    {
        res.send(error);
    }
};