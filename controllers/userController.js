const db = require('../models')
const User = db.User

const userController = {
  getUser: (req, res, next) => {
    User.findByPk(req.params.id, { raw: true, nest: true })
      .then((user) => {
        if (!user.avatar) {
          user.avatar = 'https://loremflickr.com/cache/resized/defaultImage.small_320_240_nofilter.jpg'
        }
        return res.render('profile', { users: req.body.user, profile: user })
      })
      .catch(next)
  },
  getEditUser: (req, res, next) => {},
  updateUser: (req, res, next) => {}
}
module.exports = userController
