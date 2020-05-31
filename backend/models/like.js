'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    messageId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Message',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    likeType: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Like.belongsTo(models.Message, {
      foreignKey: 'messageId',
      as: 'message'
    });

  };
  return Like;
};