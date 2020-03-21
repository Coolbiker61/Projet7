const Sequelize = require('sequelize');
const Model = Sequelize.Model;

Sequelize.define('user', {
    email: {
      type: Sequelize.STRING,
      allowNull: false
      /*validate: {
        is: ["[a-z]",'i'],        // will only allow letters
        max: 23,                  // only allow values <= 23
        isIn: {
          args: [['en', 'zh']],
          msg: "Must be English or Chinese"
        }*/
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });
  
module.exports = sequelize.models.user;
  