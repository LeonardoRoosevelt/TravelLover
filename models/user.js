'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Tracker)
      User.hasMany(models.Marker)
      User.hasMany(models.Blog)
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      background: DataTypes.STRING,
      account: DataTypes.STRING,
      bio: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'User'
    }
  )
  return User
}
