const express = require('express')
const router = express.Router()
const blogController = require('../../controllers/blogController')
const filterController = require('../../controllers/filterController')


router.get('/', blogController.getBlog)
router.get('/createBlog', blogController.getCreateBlog)
router.post('/', blogController.createBlog)
router.delete('/:blogId', blogController.deleteBlog)
router.put('/:blogId', blogController.updateBlog)
router.get('/:blogId/edit', blogController.editBlogPage)
router.get('/filters', filterController.filterBlogs)

module.exports = router