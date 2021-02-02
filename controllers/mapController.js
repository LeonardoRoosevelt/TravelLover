const db = require('../models')
const Blog = db.Blog
const Marker = db.Marker
const { monthFilter, yearFilter } = require('../public/javascript/function')

const mapController = {
  getMap: (req, res, next) => {
    let monthsList = [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月'
    ]
    Marker.findAll({ raw: true, nest: true }).then((markers) => {
      const yearsList = [...new Set(markers.map((marker) => yearFilter(marker.createdAt)))]
      const typesList = [...new Set(markers.map((marker) => marker.type))]
      return res.render('map', {
        url: '/map/json',
        yearsList,
        monthsList,
        typesList
      })
    })
  },
  getMapJson: (req, res, next) => {
    return Marker.findAll({
      attributes: ['lat', 'lng'],
      include: [{ model: Blog, attributes: ['location'], limit: 1 }]
    }).then((markers) => {
      return res.json(markers)
    })
  },
  getMapFilterJson: (req, res, next) => {
    const { year, month, type } = req.params
    let markerList = []
    let monthsList = [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月'
    ]
    Marker.findAll({ raw: true, nest: true }).then((markers) => {
      Promise.all([
        markers.map((marker) => {
          let currentYear = yearFilter(marker.createdAt).toString()
          let currentMonth = monthsList[monthFilter(marker.createdAt)]
          if (type === '全部' && month === '全部' && year === '全部') {
            markerList.push(marker)
          } else if (month === '全部' && year === '全部') {
            if (type === marker.type) {
              markerList.push(marker)
            }
          } else if (type === '全部' && year === '全部') {
            if (month === currentMonth) {
              markerList.push(marker)
            }
          } else if (month === '全部' && type === '全部') {
            if (year === currentYear) {
              markerList.push(marker)
            }
          } else if (year === '全部') {
            if (month === currentMonth && type === marker.type) {
              markerList.push(marker)
            }
          } else if (month === '全部') {
            if (year === currentYear && type === marker.type) {
              markerList.push(marker)
            }
          } else if (type === '全部') {
            if (month === currentMonth && year === currentYear) {
              markerList.push(marker)
            }
          } else {
            if (month === currentMonth && type === marker.type && year === currentYear) {
              markerList.push(marker)
            }
          }
        })
      ])
      return res.json(markerList)
    })
  }
}

module.exports = mapController
