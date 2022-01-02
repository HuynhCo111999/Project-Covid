const express = require('express');
const router = express.Router();
const locationManagement = require('../controllers/treatmentLocationManagement.controller');
const { verifySignUp, authJwt } = require("../middleware");
const authController = require("../controllers/auth.controller");
const UserController = require("../controllers/user.controller")

router.get('/', async(req, res) => {
    res.render('admin/listUser',{
        layout: 'admin/main'
    });
});

router.get('/treatment-location', locationManagement.index);
router.post('/add-location', locationManagement.add);
router.post('/update-location/:id', locationManagement.update);

router.get('/users', UserController.getModerators);
router.post('/createUser', 
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
    authJwt.verifyToken,
    authJwt.isAdmin
  ], 
  authController.createUser
);

router.post('/deleteUser', 
  [
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  authController.deleteUser
)

module.exports = router;