const adminController = {
  admin: (req, res, next) => {
    res.render('./admin/admin')
  },
  getBlogs: (req, res, next) => {},
  getBlog: (req, res, next) => {},
  getTrackers: (req, res, next) => {},
  getTracker: (req, res, next) => {},
  getMarkers: (req, res, next) => {},
  getMarker: (req, res, next) => {},
  getCategories: (req, res, next) => {},
  getUsers: (req, res, next) => {},
  getUser: (req, res, next) => {}
}

module.exports = adminController
