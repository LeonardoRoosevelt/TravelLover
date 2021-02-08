const express = require('express')
const router = express.Router()

const blog = require('./modules/blogs')
const user = require('./modules/users')
const tracker = require('./modules/trackers')
const map = require('./modules/map')
const auth = require('./modules/auth')
const admin = require('./modules/admin')
const { authenticator, authenticateAdmin } = require('../middleware/auth')

router.use('/admin', authenticateAdmin, admin)
router.use('/blogs', authenticator, blog)
router.use('/trackers', authenticator, tracker)
router.use('/map', authenticator, map)
router.use('/users', authenticator, user)
router.use('/', auth)
router.use((req, res, next) => {
  res.status(404).render('error', { user: null })
})

module.exports = router
