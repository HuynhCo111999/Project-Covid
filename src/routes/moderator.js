const router = require("express").Router();
const moderatorController = require("../controllers/moderator.controller");

// localhost:3000/moderator
router.get("/", moderatorController.getIndex);
router.get("/add-user", moderatorController.getAddUser);

module.exports = router;
