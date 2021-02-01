'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tracker.belongsTo(models.Category)
      Tracker.belongsTo(models.Marker)
    }
  }
  Tracker.init(
    {
      product: DataTypes.STRING,
      date: DataTypes.DATE,
      price: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
      location: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Tracker'
    }
  )
  return Tracker
}
