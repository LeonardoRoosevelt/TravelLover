const express = require('express')
const router = express.Router()

const trackerController = require('../../controllers/trackerController')
const filterController = require('../../controllers/filterController')

router.get('/', trackerController.getRecord)
router.get('/createRecord', trackerController.getCreateRecord)
router.post('/', trackerController.createRecord)
router.get('/:recordId/edit', trackerController.updateRecordPage)
router.delete('/:recordId', trackerController.deleteRecord)
router.put('/:recordId', trackerController.updateRecord)
router.get('/filters', filterController.filterRecords)

module.exports = router