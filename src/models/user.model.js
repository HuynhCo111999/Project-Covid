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
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      isFirst: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      }
    });
  
    return User;
  };
  