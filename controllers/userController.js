const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
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
  getEditUser: (req, res, next) => {
    User.findByPk(req.params.id).then((user) => {
      return res.render('editProfile', { user: req.user, profile: user.toJSON() })
    })
  },
  updateUser: (req, res, next) => {
    const UserId = req.params.id
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const files = req.files || {}
    console.log(files)
    if (files) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      if (files.avatar && files.background) {
        const avatarFile = files.avatar[0].path
        const backgroundFile = files.background[0].path
        return Promise.all([imgur.uploadFile(avatarFile), imgur.uploadFile(backgroundFile)])
          .then(([avatar, background]) => updateProfile(req, res, UserId, name, avatar.data.link, background.data.link))
          .catch(next)
      } else if (files.avatar) {
        const avatarFile = files.avatar[0].path

        return imgur
          .uploadFile(avatarFile)
          .then((avatar) => updateProfile(req, res, UserId, name, avatar.data.link, null))
          .catch(next)
      } else if (files.background) {
        const backgroundFile = files.background[0].path
        return imgur
          .uploadFile(backgroundFile)
          .then((background) => updateProfile(req, res, UserId, name, null, background.data.link))
          .catch(next)
      } else {
        return Promise.all([updateProfile(req, res, UserId, name, null, null)]).catch(next)
      }
    }
  }
}

function updateProfile(req, res, UserId, name, newAvatar, newBackground) {
  User.findByPk(UserId).then((user) => {
    user
      .update({
        name: name,
        avatar: newAvatar ? newAvatar : user.avatar,
        background: newBackground ? newBackground : user.background
      })
      .then((user) => {
        req.flash('success_messages', 'user was successfully to update')
        res.redirect(`/users/${user.id}`)
      })
  })
}
module.exports = userController
