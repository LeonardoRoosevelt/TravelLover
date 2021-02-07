'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Blog.belongsTo(models.Marker)
      Blog.belongsTo(models.User)
    }
  }
  Blog.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      album: DataTypes.STRING,
      location: DataTypes.STRING,
      UserId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Blog'
    }
  )
  return Blog
}
