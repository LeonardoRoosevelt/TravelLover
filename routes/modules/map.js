const express = require('express')
const router = express.Router()

const mapController = require('../../controllers/mapController')

router.get('/', mapController.getMap)
router.get('/json', mapController.getMapJson)

module.exports = router
