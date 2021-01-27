const mapController = {
  getMap: (req, res, next) => {
    res.render('map')
  },
  getMapJson: (req, res, next) => {},
}

module.exports = mapController
