const router = require("express").Router();
const userController = require("../controllers/user.controller");

// localhost:3000/user
router.get("/personal-information", userController.getPersonalInformation);
router.get("/history-necessity-combo", userController.getHistoryNecessityCombo);
router.get("/change-information", userController.getChangeInformation);
router.post("/change-information", userController.postChangeInformation);
router.get("/buy-necessity-combo", userController.getBuyNecessityCombo);
router.post("/order", userController.postOrderNecessityCombo);
router.get("/cart", userController.getCart);
router.post("/cart/add/:name", userController.postAddCart);
router.get("/cart/delete/:id", userController.deleteCart);
router.get("/", userController.getIndex);

module.exports = router;