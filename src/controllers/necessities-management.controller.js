const covidNecessity = require("../models/index").covidNecessity;
const covidNecessityOfCombo = require("../models/index").covidNecessityOfCombo;
const covidNecessityCombo = require("../models/index").covidNecessityCombo;
const fs = require("fs");
const path = require("path");
const MIN_COMBO_LENGTH = 2;

exports.get = async (req, res) => {
  const necessities = await covidNecessity.findAll({ raw: true });

  res.render("moderator/necessities-management", {
    layout: "moderator/main",
    necessities: necessities,
    function: "necessities-product",
  });
};

exports.add = async (req, res) => {
  try {
    await covidNecessity.create({
      name: req.body.name,
      price: req.body.price,
      unit_of_measurement: req.body.unit,
      image_path: `/uploads/` + req.file.filename,
    });
    res.redirect("./necessities");
  } catch (error) {
    res.send(error);
  }
};

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (req.file) {
      const instance = await covidNecessity.findOne({
        where: {
          id: id,
        },
      });
      var image_path = path.join(__dirname, `../public/${instance.image_path}`);
      fs.unlink(image_path, async (error) => {
        if (error) throw error;
        await covidNecessity.update(
          {
            name: req.body.name,
            price: req.body.price,
            unit_of_measurement: req.body.unit,
            image_path: `/uploads/` + req.file.filename,
          },
          {
            where: {
              id: id,
            },
          }
        );
        res.redirect("../necessities");
      });
    } else {
      await covidNecessity.update(
        {
          name: req.body.name,
          price: req.body.price,
          unit_of_measurement: req.body.unit,
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.redirect("../necessities");
    }
  } catch (error) {
    res.send(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const _instance = await covidNecessityOfCombo.findAll({
      where: {
        id_necessity: id,
      },
    });
    _instance.forEach(i => {
      const comboId = i.id_combo;
      covidNecessityOfCombo.destroy({
        where: {
          id_combo: comboId,
          id_necessity: id,
        },
      }).then(
        () => {
          covidNecessityOfCombo.findAll({
            where: {
              id_combo: comboId,
            },
          }).then(
            (comboInstance) => {
              if(comboInstance.length < MIN_COMBO_LENGTH)
              {
                covidNecessityOfCombo.destroy({
                  where: {
                    id_combo: comboId,
                  },
                }).then(
                  () => {
                    covidNecessityCombo.destroy({
                      where: {
                        id: comboId,
                      },
                    });
                  }
                );
              }
            }
          );
        }
      );
    });
    covidNecessity.findOne({
      where: {
        id: id,
      },
    }).then(
      (instance) => {
        var image_path = path.join(__dirname, `../public/${instance.image_path}`);
        fs.unlink(image_path, async (error) => {
          if (error) throw error;
          await covidNecessity.destroy({
            where: {
              id: id,
            },
          });
          res.redirect("../necessities");
        });
      }
    );
  } catch (error) {
    res.send(error);
  }
};
