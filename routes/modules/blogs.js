const express = require('express')
const router = express.Router()
const blogController = require('../../controllers/blogController')
const filterController = require('../../controllers/filterController')

router.get('/', blogController.getBlogs)
router.post('/', blogController.createBlog)
router.get('/createBlog', blogController.getCreateBlog)
router.get('/filters', filterController.filterBlogs)
router.get('/:blogId', blogController.getBlog)
router.delete('/:blogId', blogController.deleteBlog)
router.put('/:blogId', blogController.updateBlog)
router.get('/:blogId/edit', blogController.editBlogPage)
router.get('/createBlog/:location', blogController.getCreateBlogByLocationRequest)
router.get('/createBlog/:location/:locationName', blogController.getCreateBlogByLocationRequest)

module.exports = router
