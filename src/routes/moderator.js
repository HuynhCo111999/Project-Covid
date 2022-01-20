const router = require("express").Router();
const moderatorController = require("../controllers/moderator.controller");
const necessitiesController = require("../controllers/necessities-management.controller");
const necessitiesComboController = require("../controllers/necessities-combo.controller");
const { check, body } = require("express-validator/check");
const upload = require("../middleware/upload");
const { route } = require("express/lib/application");
const analysis = require("../controllers/analysis.controller");
const isMod = require("../middleware/isMod");

// localhost:3000/moderator
router.get("/", isMod, moderatorController.getIndex);
router.get("/add-user", isMod, moderatorController.getAddUser);

router.get("/necessities", isMod, necessitiesController.get);
router.get("/necessities-combo", isMod, necessitiesComboController.get);
router.get(
  "/necessities-combo-details/:id",
  isMod,
  necessitiesComboController.getDetails
);
router.get("/necessity-details/:id", isMod, necessitiesController.getDetails);

router.post(
  "/add-necessity",
  isMod,
  upload.single("upload"),
  necessitiesController.add
);
router.post(
  "/update-necessity/:id",
  isMod,
  upload.single("edit_upload"),
  necessitiesController.update
);
router.post("/delete-necessity/:id", isMod, necessitiesController.delete);
router.post("/add-necessity-combo", isMod, necessitiesComboController.add);
router.post(
  "/update-necessity-combo/:id",
  isMod,
  necessitiesComboController.update
);
router.post(
  "/delete-necessity-combo/:id",
  isMod,
  necessitiesComboController.delete
);
router.post(
  "/add-necessity-to-combo/:id",
  isMod,
  necessitiesComboController.addDetails
);
router.post(
  "/remove-necessity-from-combo/:id",
  isMod,
  necessitiesComboController.removeDetails
);
router.post(
  "/update-necessity-for-combo/:id",
  isMod,
  necessitiesComboController.updateDetails
);
router.post(
  "/add-image-to-necessity/:id",
  isMod,
  upload.single("upload"),
  necessitiesController.addImages
);
router.post(
  "/remove-image-from-necessity/:id",
  isMod,
  necessitiesController.removeImages
);

router.get('/analysis', isMod,analysis.index);
router.post('/api/getamountbytime', isMod, analysis.getAmountByTime);
router.post('/api/getamountbycombo', isMod, analysis.getAmountByCombo);



router.post(
  "/add-user",
  isMod,
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
    body("status", "Không được để trống").trim().isLength({ min: 1 }),
    body("place", "Nơi điều trị không được để trống.").isLength({ min: 1 }),
  ],
  moderatorController.postAddUser
);

router.get("/edit-user/:id", isMod, moderatorController.getEditUser);
router.get("/edit-user", isMod, moderatorController.getIndexFromEdit);
router.post(
  "/edit-user",
  isMod,
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
    body("place", "Nơi điều trị không được để trống.").isLength({ min: 1 }),
  ],
  moderatorController.editUser
);

module.exports = router;
