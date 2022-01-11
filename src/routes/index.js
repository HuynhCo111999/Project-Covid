const express = require('express');
const router = express.Router();
const controller = require("../controllers/auth.controller");

router.get('/', async(req, res) => {
    controller.checkfirst().then((isCheck) => {
        console.log('check:', isCheck);
        if(!isCheck) {
            return res.render('register', {
                layout: 'main'
            })
        } else {
            const access_token = req.cookies['access_token'];
            const role = req.cookies['role']
            if(!access_token) {
                return res.render('login',{
                    layout: 'main'
                });
            }
            else {
                if(role === "admin") {
                    return res.redirect('/admin/users')
                } else if (role === "moderator") {
                    return res.redirect('/moderator')
                } else {
                    return res.redirect('/user')
                }
            }
        }
    })
});

router.get('/logout', controller.logout);

module.exports = router;