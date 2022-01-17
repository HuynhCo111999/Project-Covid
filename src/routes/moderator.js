const router = require("express").Router();
const moderatorController = require("../controllers/moderator.controller");
const necessitiesController = require("../controllers/necessities-management.controller");
const { check, body } = require("express-validator/check");
const { route } = require("express/lib/application");

// localhost:3000/moderator
router.get("/", moderatorController.getIndex);
router.get("/add-user", moderatorController.getAddUser);
router.get("/necessities", necessitiesController.get);
router.post("/add-necessity", necessitiesController.add);
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
    body("status", "Không được để trống").trim().isLength({ min: 1 }),
    body("place", "Nơi điều trị không được để trống.").isLength({ min: 1 }),
  ],
  moderatorController.postAddUser
);

router.get("/edit-user/:id", moderatorController.getEditUser);
router.get("/edit-user", moderatorController.getIndexFromEdit);
router.post(
  "/edit-user",
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
