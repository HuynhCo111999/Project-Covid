const covidNecessity = require("../models/index").covidNecessity;
const fs = require("fs");
const path = require("path");

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
    const instance = await covidNecessity.findOne({
      where: {
        id: id,
      },
    });
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
  } catch (error) {
    res.send(error);
  }
};
