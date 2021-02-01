const db = require('../models')
const Tracker = db.Tracker
const Category = db.Category
const Marker = db.Marker
const dayjs = require('dayjs')
const { yearFilter } = require('../public/javascript/function')

const trackController = {
  getRecord: (req, res, next) => {
    let totalAmount = 0
    let categoriesList = []
    let yearsList = []
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
    Tracker.findAll({ raw: true, nest: true, order: [['date', 'ASC']], include: [{ model: Category }] })
      .then((records) => {
        yearsList = [...new Set(records.map((record) => yearFilter(record.date)))]
        totalAmount = records.map((record) => record.price).reduce((a, b) => a + b, 0)
        Promise.all([
          records.forEach((record) => {
            record.date = dayjs(record.date).format('YYYY/MM/DD')
            record.CategoryId = record.Category.icon
          }),
          Category.findAll({ raw: true }).then((categories) => {
            categories.forEach((category) => {
              categoriesList.push(category)
            })
          })
        ]).then(() => {
          return res.render('tracker', {
            records,
            totalAmount,
            yearsList,
            categoriesList,
            monthsList
          })
        })
      })
      .catch(next)
  },
  getCreateRecord: (req, res, next) => {
    Category.findAll({ raw: true }).then((categories) => {
      res.render('newRecord', { categories })
    })
  },
  createRecord: (req, res, next) => {
    const { product, date, price, categoryId, location, lat, lng } = req.body
    console.log(lat)
    if (lat !== '') {
      return Marker.findOrCreate({
        raw: true,
        where: { lat: lat, lng: lng, type: 'record' },
        defaults: { type: 'record' }
      })
        .then((marker) => {
          console.log(marker)
          return Tracker.create({
            product,
            date,
            price,
            CategoryId: categoryId,
            location,
            MarkerId: marker[0].id
          }).then((record) => {
            console.log(record)
            return res.redirect('/trackers')
          })
        })
        .catch(next)
    }
    return Tracker.create({ product, date, price, CategoryId: categoryId, location })
      .then((record) => {
        console.log(record)
        return res.redirect('/trackers')
      })
      .catch(next)
  },
  deleteRecord: (req, res, next) => {
    const { recordId } = req.params
    Tracker.findByPk(recordId)
      .then((record) => {
        return record.destroy().then((record) => {
          res.redirect('/trackers')
        })
      })
      .catch(next)
  },
  updateRecord: (req, res, next) => {
    const { recordId } = req.params
    const { product, date, price, categoryId } = req.body
    Tracker.findByPk(recordId)
      .then((record) => {
        return record.update({ product, date, price, CategoryId: categoryId }).then((record) => {
          res.redirect('/trackers')
        })
      })
      .catch(next)
  },
  updateRecordPage: (req, res, next) => {
    const { recordId } = req.params
    Tracker.findByPk(recordId, { raw: true, nest: true, include: { model: Category } })
      .then((record) => {
        categoryName = record.Category.category
        record.date = record.date.toISOString().slice(0, 10)
        return Category.findAll({ raw: true }).then((categories) => {
          return res.render('newRecord', { record, categories, categoryName })
        })
      })
      .catch(next)
  },
  getCreateRecordByLocationRequest: (req, res, next) => {
    const { location, locationName } = req.params
    // 獲得latLng
    const latLng = location
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim())
    const lat = latLng[0]
    const lng = latLng[1]
    return Category.findAll({ raw: true }).then((categories) => {
      return res.render('newRecord', { lat, lng, locationName, categories })
    })
  }
}

module.exports = trackController
