const covidNecessityCombo = require("../models/index").covidNecessityCombo;
const covidNecessity = require("../models/index").covidNecessity;
const covidNecessityOfCombo = require("../models/index").covidNecessityOfCombo;

exports.get = async (req, res) => {
    const combos = await covidNecessityCombo.findAll({ raw: true });
    const necessities = await covidNecessity.findAll({ raw: true });
    res.render("moderator/necessities-combo",
                {
                    layout: "moderator/main",
                    necessities: necessities,
                    combos: combos,
                    function: "necessities-package",
                });
};

exports.add = async (req, res) => {
    try
    {   
        var comboInstance;
        if (req.body.cycle == "day") {
            comboInstance = await covidNecessityCombo.create({
                name: req.body.name,
                sales_limit: req.body.limit,
            });
        }
        else
        {
            if(req.body.cycle == "week")
            {
                comboInstance = await covidNecessityCombo.create({
                    name: req.body.name,
                    sales_limit: req.body.limit,
                    sales_cycle: false,
                });
            }
            else //month
            {
                comboInstance = await covidNecessityCombo.create({
                    name: req.body.name,
                    sales_limit: req.body.limit,
                    sales_cycle: true,
                });
            }
        }
        // const comboInstance = await covidNecessityCombo.create({
        //                 name: req.body.name,
        //                 sales_limit: req.body.limit,
        //                 sales_cycle: req.body.cycle,
        //             });
        
        var necessityInfo_1 = req.body.necesstity_to_add_1;
        var necessityInfo_2 = req.body.necesstity_to_add_2;
        const id_necessity_1 = parseInt(necessityInfo_1.split(".")[0].trim());
        const id_necessity_2 = parseInt(necessityInfo_2.split(".")[0].trim());

        await covidNecessityOfCombo.create({
            id_combo: comboInstance.id,
            id_necessity: id_necessity_1,
            min_limit: req.body.min_1,
            max_limit: req.body.max_1,
        });
        await covidNecessityOfCombo.create({
            id_combo: comboInstance.id,
            id_necessity: id_necessity_2,
            min_limit: req.body.min_2,
            max_limit: req.body.max_2,
        });

        res.redirect('./necessities-combo');
    }
    catch (error)
    {
        res.send(error);
    }
};

exports.getDetails = async (req, res) => {
    //const combos = await covidNecessityCombo.findAll({ raw: true });
    const necessities = await covidNecessity.findAll({ raw: true });
    return res.render("moderator/necessities-combo-details",
                {
                    layout: "moderator/main",
                    necessities: necessities,
                });
};

exports.addDetails = (req, res) => {
    try
    {
        // await covidNecessity.create({
        //     name: req.body.name,
        //     price: req.body.price,
        //     unit_of_measurement: req.body.unit,
        //     image_path: `/uploads/` + req.file.filename,
        // });
        res.redirect('./necessities-combo-details/1');
    }
    catch (error)
    {
        res.send(error);
    }
};