const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  getUser: (req, res, next) => {
    User.findByPk(req.user.id, { raw: true, nest: true })
      .then((user) => {
        if (!user.avatar) {
          user.avatar = 'https://loremflickr.com/cache/resized/defaultImage.small_320_240_nofilter.jpg'
        }
        return res.render('profile', { users: req.body.user, profile: user })
      })
      .catch(next)
  },
  getEditUser: (req, res, next) => {
    const userId = req.user.id
    User.findByPk(userId).then((user) => {
      return res.render('editProfile', { user: req.user, profile: user.toJSON() })
    })
  },
  updateUser: (req, res, next) => {
    const userId = req.user.id
    const { name, bio, password, confirmPassword } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    if (bio.length > 140) {
      req.flash('error_messages', 'The words length must under 140')
      return res.redirect('back')
    }
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        req.flash('error_messages', 'Password is not match with confirmPassword')
        return res.redirect('back')
      }
    }
    if ((password && !confirmPassword) || (!password && confirmPassword)) {
      req.flash('error_messages', 'Please enter both to change your password')
      return res.redirect('back')
    }
    const files = req.files || {}
    if (files) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      if (files.avatar && files.background) {
        const avatarFile = files.avatar[0].path
        const backgroundFile = files.background[0].path
        return Promise.all([imgur.uploadFile(avatarFile), imgur.uploadFile(backgroundFile)])
          .then(([avatar, background]) =>
            updateProfile(req, res, userId, name, bio, password, avatar.data.link, background.data.link)
          )
          .catch(next)
      } else if (files.avatar) {
        const avatarFile = files.avatar[0].path

        return imgur
          .uploadFile(avatarFile)
          .then((avatar) => updateProfile(req, res, userId, name, bio, password, avatar.data.link, null))
          .catch(next)
      } else if (files.background) {
        const backgroundFile = files.background[0].path
        return imgur
          .uploadFile(backgroundFile)
          .then((background) => updateProfile(req, res, userId, name, bio, password, null, background.data.link))
          .catch(next)
      } else {
        return Promise.all([updateProfile(req, res, userId, name, bio, password, null, null)]).catch(next)
      }
    }
  }
}

function updateProfile(req, res, userId, name, bio, password, newAvatar, newBackground) {
  User.findByPk(userId).then((user) => {
    user
      .update({
        name: name,
        avatar: newAvatar ? newAvatar : user.avatar,
        background: newBackground ? newBackground : user.background,
        bio: bio ? bio : user.bio,
        password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : user.password
      })
      .then((user) => {
        req.flash('success_messages', 'user was successfully to update')
        res.redirect(`/users`)
      })
  })
}
module.exports = userController
