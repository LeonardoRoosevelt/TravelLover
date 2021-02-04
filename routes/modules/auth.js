const express = require('express')
const router = express.Router()
const authController = require('../../controllers/authController')

router.get('/signup', authController.signUpPage)
router.post('/signup', authController.signUp)

module.exports = router
