const covidNecessityCombo = require("../models/index").covidNecessityCombo;
const covidNecessity = require("../models/index").covidNecessity;
const covidNecessityOfCombo = require("../models/index").covidNecessityOfCombo;
const fs = require("fs");
const path = require("path");
const MIN_COMBO_LENGTH = 2;

exports.get = async (req, res) => {

    const upload_path = path.join(__dirname, `../public/uploads`);
    if (fs.existsSync(upload_path)) {
        //Do nothing
      } else {
        fs.mkdir(upload_path, (error) => {
          if (error) throw error;
        });
    }

    const combos = await covidNecessityCombo.findAll({ raw: true });
    const necessities = await covidNecessity.findAll({ raw: true });
    res.render("moderator/necessities-combo",
                {
                    layout: "moderator/main",
                    necessities: necessities,
                    combos: combos,
                    function: "necessities-package",
                    title: "Gói nhu yếu phẩm",
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

exports.update = async (req, res) => {
    try
    {
        const id = req.params.id;
        var sales_cycle;
        if (req.body.cycle == "day") {
            sales_cycle = null;
        }
        else
        {
            if(req.body.cycle == "week")
            {
                sales_cycle = false;
            }
            else //month
            {
                sales_cycle = true;
            }
        }

        await covidNecessityCombo.update({
            name: req.body.name,
            sales_limit: req.body.limit,
            sales_cycle: sales_cycle,
        },
            {
                where:
                {
                    id: id,
                },
            },
        );

        res.redirect(`../necessities-combo-details/${id}`);
    }
    catch (error)
    {
        res.send(error);
    }
}

exports.delete = async (req, res) => {
    try
    {
        const id = req.params.id;
        await covidNecessityOfCombo.destroy({
            where:
            {
                id_combo: id,
            },
        });
        await covidNecessityCombo.destroy({
            where:
            {
                id: id,
            },
        });
        res.redirect("../necessities-combo");
    }
    catch(error)
    {
        res.send(error);
    }
}

exports.getDetails = async (req, res) => {
    try
    {
        const id_combo = req.params.id;
        const necessities = await covidNecessity.findAll({ raw: true });
        const comboNecessities = await covidNecessityOfCombo.findAll({
            raw: true,
            where: {
                id_combo: id_combo,
            },
        });
        const comboInstance = await covidNecessityCombo.findByPk(id_combo);
        var listNecessities = [];
        comboNecessities.forEach( necessity => {
            covidNecessity.findOne(
                {
                    where: { id: necessity.id_necessity },

                }).then(
                (instance) => {
                    const tempDetails = {
                        id: necessity.id,
                        id_combo: necessity.id_combo,
                        id_necessity: necessity.id_necessity,
                        max_limit: necessity.max_limit,
                        min_limit: necessity.min_limit,
                        name: instance.name,
                        price: instance.price,
                        unit_of_measurement: instance.unit_of_measurement,
                    }
                    listNecessities.push(tempDetails);
                }
            );
        });
        
        return res.render("moderator/necessities-combo-details",
                    {
                        layout: "moderator/main",
                        necessities: necessities,
                        comboNecessities: comboNecessities,
                        listNecessities: listNecessities,
                        comboId: id_combo,
                        comboName: comboInstance.name,
                        comboSalesLimit: comboInstance.sales_limit,
                        comboSalesCycle: comboInstance.sales_cycle,
                        title: "Chi tiết gói nhu yếu phẩm",
                    });
    }
    catch(error)
    {
        return res.send(error);
    }
};

exports.addDetails = async (req, res) => {
    try
    {   
        const id = parseInt(req.params.id);
        var necessityInfo = req.body.necesstity_to_add;
        const id_necessity = parseInt(necessityInfo.split(".")[0].trim());
        await covidNecessityOfCombo.create({
            id_necessity: id_necessity,
            id_combo: id,
            min_limit: req.body.min,
            max_limit: req.body.max,
        });
        res.redirect(`../necessities-combo-details/${id}`);
    }
    catch (error)
    {
        res.send(error);
    }
};

exports.removeDetails = async (req, res) => {
    try
    {   
        const id = parseInt(req.params.id);
        const instance = await covidNecessityOfCombo.findOne({
            where: {
              id: id,
            },
        });
        const id_combo = instance.id_combo;
        await covidNecessityOfCombo.destroy({
            where: {
              id: id,
            },
        });
        const comboInstance = await covidNecessityOfCombo.findAll({
            where: {
              id_combo: id_combo,
            },
        });
        if( comboInstance.length < MIN_COMBO_LENGTH )
        {
            covidNecessityOfCombo.destroy({
                where: {
                  id_combo: id_combo,
                },
              }).then(
                () => {
                  covidNecessityCombo.destroy({
                    where: {
                      id: id_combo,
                    },
                  }).then(
                      () => {
                        res.redirect("../necessities-combo");
                      }
                  );
                }
              );
        }
        else
        {
            res.redirect(`../necessities-combo-details/${id_combo}`);
        }
    }
    catch (error)
    {
        res.send(error);
    }
};

exports.updateDetails = async (req, res) => {
    try
    {   
        const id = parseInt(req.params.id);
        const instance = await covidNecessityOfCombo.findOne({
            where: {
              id: id,
            },
        });
        const id_combo = instance.id_combo;
        var necessityInfo = req.body.necesstity_to_update;
        const id_necessity = parseInt(necessityInfo.split(".")[0].trim());
        await covidNecessityOfCombo.update({
                id_necessity: id_necessity,
                id_combo: id_combo,
                min_limit: req.body.min,
                max_limit: req.body.max,
            },   
            {
                where: {
                id: id,
            },
        });
        res.redirect(`../necessities-combo-details/${id_combo}`);
    }
    catch (error)
    {
        res.send(error);
    }
};