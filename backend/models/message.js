'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    likes: DataTypes.INTEGER
  });
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    }),
    Message.hasMany(models.Like, { foreignKey: 'messageId'}, { onDelete: 'cascade' }),
    Message.hasMany(models.Comment, { foreignKey: 'messageId'}, { onDelete: 'cascade' })
  };
  return Message;
};