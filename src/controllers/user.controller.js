const db = require('../models');
const User = db.user;

exports.getModerators = async (req, res) => {
  const  listUsers = await User.findAll({ raw: true });
  let filterUsers = [];
  await listUsers.map(item => {
    User.findOne({
      where: {
        id: item.id
      }
    }).then((user) => {
      user.getRoles().then(roles => {
        console.log(roles[0].name)
        if(roles[0].name === 'moderator') {
          let temp = {...item, role: roles[0].name}
          filterUsers.push(temp)
        }
      })
    })
  })
  // console.log("listUsers: ", listUsers)
  res.render('admin/listUser', {
    layout: 'admin/main',
    listUsers: filterUsers,
  });
}