const db = require('../models');
const treatmentLocation = db.treatmentLocation;

exports.index = async (req, res) => {
    const locations = await treatmentLocation.findAll({raw : true});
    locations.forEach(element => {
        if(element.current/element.capacity < 0.9) element.color = 'success';
        else element.color = 'danger';
    });
    res.render('admin/treatmentLocationManagement', {
        layout: 'admin/main',
        locations: locations,
    });
}
exports.add = async (req, res) => {
    if(req.body.current > req.body.capacity) {
        res.send('Số lượng tiếp nhận hiện tại phải nhỏ hơn sức chứa.');
        return;
    }
    await treatmentLocation.create({name: req.body.name, capacity: req.body.capacity, current: req.body.current });
    res.redirect('./treatment-location');
}
exports.update = async (req, res) => {
    if(req.body.current > req.body.capacity) {
        res.send('Số lượng tiếp nhận hiện tại phải nhỏ hơn sức chứa.');
        return;
    }
    const id = parseInt(req.params.id);
    await treatmentLocation.update({name: req.body.name, capacity: req.body.capacity, current: req.body.current }, {
        where : {
            id: id
        }
    })
    res.redirect('/admin/treatment-location');
}