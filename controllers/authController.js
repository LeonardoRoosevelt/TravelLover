const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const authController = {
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
        return res.redirect('/signin')
      })
      .catch(next)
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    res.redirect('/blogs')
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/signin')
  }
}
module.exports = authController
