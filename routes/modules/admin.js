const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')

router.get('/', adminController.getUsers)
router.delete('/:userId', adminController.deleteUser)
router.get('/:userId/blogs', adminController.getBlogs)
router.delete('/:userId/blogs/:blogId', adminController.deleteBlog)
router.get('/:userId/trackers', adminController.getRecords)
router.delete('/:userId/trackers/:trackerId', adminController.deleteRecord)
router.get('/categories', adminController.getCategories)
router.post('/categories', adminController.createCategory)
router.get('/categories/:categoryId', adminController.getCategory)
router.put('/categories/:categoryId', adminController.editCategory)
router.delete('/categories/:categoryId', adminController.deleteCategory)
router.get('/:userId/markers', adminController.getMarkers)
router.delete('/:userId/markers/:markerId/:infoId', adminController.deleteMarker)

module.exports = router
