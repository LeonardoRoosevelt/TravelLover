const express = require('express')
const router = express.Router()

const blog = require('./modules/blogs')
const user = require('./modules/users')
const tracker = require('./modules/trackers')
const map = require('./modules/map')
const auth = require('./modules/auth')

router.use('/users', user)
router.use('/blogs', blog)
router.use('/trackers', tracker)
router.use('/map', map)
router.use('/', auth)

module.exports = router
