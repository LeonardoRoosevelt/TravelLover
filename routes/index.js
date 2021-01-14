const express = require('express')
const router = express.Router()

const blog = require('./modules/blog')
const user = require('./modules/user')
const tracker = require('./modules/tracker')

router.use('/user', user)
router.use('/blog', blog)
router.use('/tracker', tracker)


module.exports = router