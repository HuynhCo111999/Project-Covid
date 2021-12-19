const router = require("express").Router();
const moderatorController = require("../controllers/moderator.controller");

// localhost:3000/moderator
router.get("/", moderatorController.getIndex);

module.exports = router;
