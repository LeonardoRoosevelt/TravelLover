const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const authController = {
  homePage: (req, res, next) => {
    return res.render('homePage')
  },
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res, next) => {
    const { name, account, email, password } = req.body
    User.findOrCreate({
      where: {
        email: email,
        account: account
      },
      defaults: {
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      }
    })
      .then(([user, created]) => {
        if (!created) {
          if (user.account === account) {
            req.flash('error_messages', 'This account already exists.')
            return res.redirect('/signup')
          }
          if (user.email === email) {
            req.flash('error_messages', 'This email already exists.')
            return res.redirect('/signup')
          }
          if (password.length < 8) {
            req.flash('error_messages', 'Please enter at least 8 characters.')
            return res.redirect('/signup')
          }
        }
        return res.redirect('/signin')
      })
      .catch(next)
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}
module.exports = authController
