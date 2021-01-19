const express = require('express')
const router = express.Router()
const blogController = require('../../controllers/blogController')


router.get('/', blogController.getBlog)
router.get('/createBlog', blogController.getCreateBlog)
router.post('/', blogController.createBlog)
router.delete('/', blogController.deleteBlog)
router.put('/:blogId', blogController.updateBlog)
router.get('/:blogId/edit', blogController.editBlogPage)

module.exports = router