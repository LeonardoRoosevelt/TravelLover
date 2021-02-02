const express = require('express')
const router = express.Router()

const mapController = require('../../controllers/mapController')
const filterController = require('../../controllers/filterController')

router.get('/', mapController.getMap)
router.get('/json', mapController.getMapJson)
router.get('/filterJson/:type/:year/:month', mapController.getMapFilterJson)
router.get('/filters', filterController.filterMap)

module.exports = router
