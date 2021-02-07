const express = require('express')
const router = express.Router()
const passport = require('passport')
const authController = require('../../controllers/authController')

router.get('/', authController.homePage)
router.get('/signup', authController.signUpPage)
router.post('/signup', authController.signUp)
router.get('/signin', authController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/blogs',
    failureRedirect: '/signin'
  })
)
router.get('/logout', authController.logout)

module.exports = router
