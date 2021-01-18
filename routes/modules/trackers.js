const express = require('express')
const router = express.Router()

const trackerController = require('../../controllers/trackerController')

router.get('/', trackerController.getRecord)
router.post('/', trackerController.createRecord)
router.delete('/', trackerController.deleteRecord)
router.put('/', trackerController.updateRecord)

module.exports = router