const router = require("express").Router();
const userController = require("../controllers/user.controller");

// localhost:3000/user
router.get('/personal-information', userController.getPersonalInformation)
router.get('/change-information', userController.getChangeInformation)
router.post('/change-information', userController.postChangeInformation)
router.get("/", userController.getIndex);


module.exports = router;