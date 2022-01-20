const covidNecessity = require("../models/index").covidNecessity;
const covidNecessityOfCombo = require("../models/index").covidNecessityOfCombo;
const covidNecessityCombo = require("../models/index").covidNecessityCombo;
const covidImagesofNecessity = require("../models/index").covidNecessityImages;
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

  const necessities = await covidNecessity.findAll({ raw: true });
  console.log("necessities: ", necessities);

  res.render("moderator/necessities-management", {
    layout: "moderator/main",
    necessities: necessities,
    function: "necessities-product",
    title: "Nhu yếu phẩm",
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
        res.redirect(`../necessity-details/${id}`);
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
      res.redirect(`../necessity-details/${id}`);
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
    _instance.forEach((i) => {
      const comboId = i.id_combo;
      covidNecessityOfCombo
        .destroy({
          where: {
            id_combo: comboId,
            id_necessity: id,
          },
        })
        .then(() => {
          covidNecessityOfCombo
            .findAll({
              where: {
                id_combo: comboId,
              },
            })
            .then((comboInstance) => {
              if (comboInstance.length < MIN_COMBO_LENGTH) {
                covidNecessityOfCombo
                  .destroy({
                    where: {
                      id_combo: comboId,
                    },
                  })
                  .then(() => {
                    covidNecessityCombo.destroy({
                      where: {
                        id: comboId,
                      },
                    });
                  });
              }
            });
        });
    });
    const imagesInstance = await covidImagesofNecessity.findAll({
      where: {
        id_necessity: id,
      },
    });
    imagesInstance.forEach((i) => {
      var image_path = path.join(__dirname, `../public/${i.image_path}`);
      fs.unlink(image_path, async (error) => {
        if (error) throw error;
      });
    });
    await covidImagesofNecessity.destroy({
      where: {
        id_necessity: id,
      },
    });
    covidNecessity
      .findOne({
        where: {
          id: id,
        },
      })
      .then((instance) => {
        var image_path = path.join(
          __dirname,
          `../public/${instance.image_path}`
        );
        fs.unlink(image_path, async (error) => {
          if (error) throw error;
          await covidNecessity.destroy({
            where: {
              id: id,
            },
          });
          res.redirect("../necessities");
        });
      });
  } catch (error) {
    res.send(error);
  }
};

exports.getDetails = async (req, res) => {
  try {
    const id_necessity = req.params.id;
    const images = await covidImagesofNecessity.findAll({
      raw: true,
      where: {
        id_necessity: id_necessity,
      },
    });
    const necessityInstance = await covidNecessity.findByPk(id_necessity);
    return res.render("moderator/necessities-details", {
      layout: "moderator/main",
      images: images,
      productId: id_necessity,
      productName: necessityInstance.name,
      productUnit: necessityInstance.unit_of_measurement,
      productPrice: necessityInstance.price,
      productPath: necessityInstance.image_path,
      title: "Chi tiết nhu yếu phẩm",
      function: "necessities-product",
    });
  } catch (error) {
    return res.send(error);
  }
};

exports.addImages = async (req, res) => {
  try {
    const id = req.params.id;
    await covidImagesofNecessity.create({
      id_necessity: id,
      image_path: `/uploads/` + req.file.filename,
    });
    res.redirect(`../necessity-details/${id}`);
  } catch (error) {
    res.send(error);
  }
};

exports.removeImages = async (req, res) => {
  try {
    const id = req.params.id;
    const instance = await covidImagesofNecessity.findByPk(id);
    const id_necessity = instance.id_necessity;
    var image_path = path.join(__dirname, `../public/${instance.image_path}`);
    fs.unlink(image_path, async (error) => {
      if (error) throw error;
      await covidImagesofNecessity.destroy({
        where: {
          id: id,
        },
      });
      res.redirect(`../necessity-details/${id_necessity}`);
    });
  } catch (error) {
    res.send(error);
  }
};
