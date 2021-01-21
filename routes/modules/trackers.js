const express = require('express')
const router = express.Router()

const trackerController = require('../../controllers/trackerController')

router.get('/', trackerController.getRecord)
router.get('/createRecord', trackerController.getCreateRecord)
router.post('/', trackerController.createRecord)
router.get('/:recordId/edit', trackerController.updateRecordPage)
router.delete('/:recordId', trackerController.deleteRecord)
router.put('/:recordId', trackerController.updateRecord)

module.exports = router