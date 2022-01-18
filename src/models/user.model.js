module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      lock: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    });
  
    return User;
  };
  