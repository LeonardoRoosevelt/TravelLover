const express = require('express')
const router = express.Router()

const blog = require('./modules/blogs')
const user = require('./modules/users')
const tracker = require('./modules/trackers')

router.use('/users', user)
router.use('/blogs', blog)
router.use('/trackers', tracker)


module.exports = router