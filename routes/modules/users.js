const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/', userController.getUser)
router.get('/edit', userController.getEditUser)
router.put(
  '/',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 }
  ]),
  userController.updateUser
)

module.exports = router
