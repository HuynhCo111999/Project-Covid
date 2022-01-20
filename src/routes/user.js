const router = require("express").Router();
const userController = require("../controllers/user.controller");
const isUser = require("../middleware/isUser");

// localhost:3000/user
router.get(
  "/personal-information",
  isUser,
  userController.getPersonalInformation
);
router.get(
  "/history-necessity-combo",
  isUser,
  userController.getHistoryNecessityCombo
);
router.get("/change-information", isUser, userController.getChangeInformation);
router.post(
  "/change-information",
  isUser,
  userController.postChangeInformation
);
router.get("/buy-necessity-combo", isUser, userController.getBuyNecessityCombo);
router.post("/order", isUser, userController.postOrderNecessityCombo);
router.get("/cart", isUser, userController.getCart);
router.post("/cart/add/:name", isUser, userController.postAddCart);
router.get("/cart/delete/:id", isUser, userController.deleteCart);
router.get("/", isUser, userController.getIndex);
router.get("/user-to-payment", isUser, userController.getPayment);
module.exports = router;
