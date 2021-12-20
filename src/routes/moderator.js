const router = require("express").Router();
const moderatorController = require("../controllers/moderator.controller");
const { check, body } = require("express-validator/check");

// localhost:3000/moderator
router.get("/", moderatorController.getIndex);
router.get("/add-user", moderatorController.getAddUser);
router.post(
  "/add-user",
  [
    body("name", "Họ và tên không được ít hơn 4 kí tự")
      .trim()
      .isLength({ min: 4 }),
    body("name", "Họ và tên không được chứa số và các ký tự đặc biệt")
      .trim()
      .isAlpha(),
    body("card", "CMND/CCCD phải từ 9 đến 12 chữ số").isLength({
      min: 9,
      max: 12,
    }),
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
