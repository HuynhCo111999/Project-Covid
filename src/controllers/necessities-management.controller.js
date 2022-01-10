const covidNecessity = require("../models/index").covidNecessity;

exports.get = async (req, res) => {
    const necessities = await covidNecessity.findAll({ raw: true });
    
    res.render("moderator/necessities-management",
                {
                    layout: "moderator/main",
                    necessities: necessities,
                });
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

exports.update = async (req, res) => {
    try
    {
        const id = parseInt(req.params.id);
        await covidNecessity.update({
            name: req.body.name,
            price: req.body.price,
            unit_of_measurement: req.body.unit
        }, 
            {
                where: {
                    id: id
                }
        });
        res.redirect('../necessities');
    }
    catch (error)
    {
        res.send(error);
    }
};