'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  });
  User.associate = (models) => {
    User.hasMany(models.Message,{ foreignKey: 'userId' }, { onDelete: 'cascade' }),
    User.hasMany(models.Like,{ foreignKey: 'userId' }, { onDelete: 'cascade' }),
    User.hasMany(models.Comment,{ foreignKey: 'userId' }, { onDelete: 'cascade' })
  };
  return User;
};