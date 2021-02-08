const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')

router.get('/', adminController.admin)
router.get('/blogs', adminController.getBlogs)
router.get('/blogs/:userId', adminController.getBlog)
router.get('/trackers', adminController.getTrackers)
router.get('/trackers/:userId', adminController.getTracker)
router.get('/categories', adminController.getCategories)
router.get('/users', adminController.getUsers)
router.get('/users/:userId', adminController.getUser)
router.get('/markers', adminController.getMarkers)
router.get('/markers/:userId', adminController.getMarker)

module.exports = router
