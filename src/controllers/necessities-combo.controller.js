const covidNecessityCombo = require("../models/index").covidNecessityCombo;

exports.get = async (req, res) => {
    const combos = await covidNecessityCombo.findAll({ raw: true });
    
    res.render("moderator/necessities-combo",
                {
                    layout: "moderator/main",
                    // combos: combos,
                });
};