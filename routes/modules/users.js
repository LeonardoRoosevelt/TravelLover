const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

router.get('/:id', userController.getUser)
router.get('/:id/edit', userController.getEditUser)
router.put('/:id', userController.updateUser)

module.exports = router
