'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Marker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Marker.hasMany(models.Blog)
      Marker.hasMany(models.Tracker)
      Marker.belongsTo(models.User)
    }
  }
  Marker.init(
    {
      lat: DataTypes.STRING,
      lng: DataTypes.STRING,
      type: DataTypes.STRING,
      createdTime: DataTypes.DATE,
      UserId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Marker'
    }
  )
  return Marker
}
