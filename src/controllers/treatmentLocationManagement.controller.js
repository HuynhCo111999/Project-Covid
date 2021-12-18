const db = require('../models');
const treatmentLocation = db.treatmentLocation;

exports.index = async (req, res) => {
    const locations = await treatmentLocation.findAll({raw : true});
    res.render('admin/treatmentLocationManagement',{
        layout: 'admin/main',
        locations: locations,
    });
}
exports.add = async (req, res) => {
    const newLocation = await treatmentLocation.create({name: req.body.name, capacity: req.body.capacity, current: req.body.current });
    res.redirect('./treatment-location');
}
