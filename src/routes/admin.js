const express = require('express');
const router = express.Router();
const locationManagement = require('../controllers/treatmentLocationManagement.controller');

router.get('/', async(req, res) => {
    res.render('admin/treatmentLocationManagement',{
        layout: 'admin/main'
    });
});
router.get('/treatment-location', locationManagement.index);
router.post('/add-location', locationManagement.add);
router.post('/update-location/:id', locationManagement.update);

module.exports = router;