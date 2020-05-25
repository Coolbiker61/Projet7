'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    messageId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Message',
        key: 'id'
      }
    },
    content: DataTypes.STRING,
    parent: {
      type: DataTypes.INTEGER,
      hierarchy: {as: 'parentId', onDelete: 'cascade'},
      
    },
    hierarchyLevel: DataTypes.INTEGER
  }, {  });
  Comment.associate = function(models) {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Comment.belongsTo(models.Message, {
      foreignKey: 'messageId',
      as: 'message'
    });
  };
  return Comment;
};