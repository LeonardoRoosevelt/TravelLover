const express = require('express')
const router = express.Router()
const blogController = require('../../controllers/blogController')


router.get('/', blogController.getBlog)
router.post('/', blogController.createBlog)
router.delete('/', blogController.deleteBlog)
router.put('/', blogController.updateBlog)


module.exports = router