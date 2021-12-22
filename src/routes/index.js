const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    const access_token = req.cookies['access_token'];
    if(!access_token) {
        res.render('login',{
            layout: 'main'
        });
    }
    else {
        res.redirect('/admin')
    }
});

module.exports = router;