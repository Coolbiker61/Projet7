'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  });
  User.associate = (models) => {
    User.hasMany(models.Message, {onDelete: 'CASCADE'}),
    User.hasMany(models.Like, { foreignKey: 'userId', onDelete: 'CASCADE' }),
    User.hasMany(models.Comment, { foreignKey: 'userId', onDelete: 'CASCADE' })
  };
  return User;
};