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
exports.update = async (req, res) => {
    const id = parseInt(req.params.id);
    await treatmentLocation.update({name: req.body.name, capacity: req.body.capacity, current: req.body.current }, {
        where : {
            id: id
        }
    })
    res.redirect('/admin/treatment-location');
}