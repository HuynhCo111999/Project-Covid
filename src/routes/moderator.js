const router = require("express").Router();
const moderatorController = require("../controllers/moderator.controller");
const necessitiesController = require("../controllers/necessities-management.controller");
const necessitiesComboController = require("../controllers/necessities-combo.controller");
const { check, body } = require("express-validator/check");
const upload = require('../middleware/upload');
const { covidNecessityCombo } = require("../models");

// localhost:3000/moderator
router.get("/", moderatorController.getIndex);
router.get("/add-user", moderatorController.getAddUser);
router.get("/necessities", necessitiesController.get);
router.get("/necessities-combo", necessitiesComboController.get);
router.get("/necessities-combo-details/:id",necessitiesComboController.getDetails);
router.post("/add-necessity", upload.single('upload'), necessitiesController.add);
router.post('/update-necessity/:id', upload.single('edit_upload'), necessitiesController.update);
router.post('/delete-necessity/:id', necessitiesController.delete);
router.post("/add-necessity-combo",necessitiesComboController.add);
router.post("/update-necessity-combo/:id",necessitiesComboController.update);
router.post("/delete-necessity-combo/:id",necessitiesComboController.delete);
router.post("/add-necessity-to-combo/:id", necessitiesComboController.addDetails);
router.post('/remove-necessity-from-combo/:id', necessitiesComboController.removeDetails);
router.post('/update-necessity-for-combo/:id', necessitiesComboController.updateDetails);

router.post(
  "/add-user",
  [
    body("name", "Họ tên không được ít hơn 4 kí tự")
      .trim()
      .isLength({ min: 4 }),
    body("name", "Họ tên không được chứa số và các ký tự đặc biệt").matches(
      /^[A-Za-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ ]+$/
    ),
    body("card", "CMND/CCCD phải bao gồm 9 hoặc 12 chữ số").custom(
      (value, { req }) => {
        if (value.toString().length == 9 || value.toString().length == 12)
          return true;
      }
    ),
    body("yob", "Năm sinh không được để trống").isLength({ min: 4, max: 4 }),
    body("province", "Tỉnh/Thành không được để trống")
      .trim()
      .isLength({ min: 1 }),
    body("district", "Quận/Huyện không được để trống")
      .trim()
      .isLength({ min: 1 }),
    body("ward", "Phường/Xã không được để trống").trim().isLength({ min: 1 }),
    // body("related-person", "Tên người liên quan không được ít hơn 4 kí tự")
    //   .trim()
    //   .isLength({ min: 4 }),
    // ,
    body("place", "Nơi điều trị không được để trống")
      .trim()
      .isLength({ min: 1 }),
  ],

  moderatorController.postAddUser
);
module.exports = router;
