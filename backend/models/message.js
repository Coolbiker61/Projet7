'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  });
  Message.associate = (models) => {
    // associations can be defined here
    Message.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    }),
    Message.hasMany(models.Like, { foreignKey: 'messageId' }),
    Message.hasMany(models.Comment, { foreignKey: 'messageId' })
  };
  return Message;
};