const express = require('express')
const router = express.Router()

const blog = require('./modules/blogs')
const user = require('./modules/users')
const tracker = require('./modules/trackers')
const map = require('./modules/map')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')

router.use('/blogs', authenticator, blog)
router.use('/trackers', authenticator, tracker)
router.use('/map', authenticator, map)
router.use('/users', authenticator, user)
router.use('/', auth)

module.exports = router
