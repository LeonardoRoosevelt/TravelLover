const db = require('../models')
const Blog = db.Blog
const Marker = db.Marker

const mapController = {
  getMap: (req, res, next) => {
    res.render('map')
  },
  getMapJson: (req, res, next) => {
    Marker.findAll({
      attributes: ['lat', 'lng'],
      include: [{ model: Blog, attributes: ['location'], limit: 1 }]
    }).then((markers) => {
      return res.json(markers)
    })
  }
}

module.exports = mapController
