const express = require('express')
const router = express.Router()
const passport = require('passport')
const authController = require('../../controllers/authController')
const { authenticated } = require('../../middleware/auth')

router.get('/signup', authenticated, authController.signUpPage)
router.get('/signin', authenticated, authController.signInPage)
router.get('/', authController.homePage)
router.post('/signup', authController.signUp)
router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin'
  })
)
router.get('/logout', authController.logout)

module.exports = router
