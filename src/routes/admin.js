const express = require("express");
const router = express.Router();
const locationManagement = require("../controllers/treatmentLocationManagement.controller");
const { verifySignUp, authJwt } = require("../middleware");
const authController = require("../controllers/auth.controller");
const UserController = require("../controllers/user.controller");
const isAdmin = require("../middleware/isAdmin");

router.get("/", isAdmin, async (req, res) => {
  res.render("admin/listUser", {
    layout: "admin/main",
  });
});

router.get("/treatment-location", isAdmin, locationManagement.index);
router.post("/add-location", isAdmin, locationManagement.add);
router.post("/update-location/:id", isAdmin, locationManagement.update);

router.get("/users", isAdmin, UserController.getModerators);
router.post(
  "/createUser",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
    authJwt.verifyToken,
    authJwt.isAdmin,
  ],
  authController.createUser
);

router.post(
  "/deleteUser",
  [authJwt.verifyToken, authJwt.isAdmin],
  authController.deleteUser
);
router.post("/history", isAdmin, authController.getHistory);

router.post("/updateUser", isAdmin, authController.updateUser);

router.get("/setting-limit-credit", authController.settingLimitCredit);

module.exports = router;
