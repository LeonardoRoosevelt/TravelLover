const db = require('../models')
const Tracker = db.Tracker
const Category = db.Category
const Marker = db.Marker
const dayjs = require('dayjs')
const { yearFilter } = require('../public/javascript/function')
const pageLimit = 10

const trackController = {
  getRecord: (req, res, next) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    const userId = req.user.id
    let totalAmount = 0
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
    Tracker.findAndCountAll({
      order: [['date', 'ASC']],
      where: { UserId: userId },
      include: [{ model: Category }],
      offset: offset,
      limit: pageLimit
    })
      .then((result) => {
        let row = result.rows
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1
        yearsList = [...new Set(row.map((r) => yearFilter(r.date)))]
        totalAmount = row.map((r) => r.price).reduce((a, b) => a + b, 0)
        const data = row.map((r) => ({
          ...r.dataValues,
          date: dayjs(r.date).format('YYYY/MM/DD'),
          CategoryId: r.Category.icon
        }))
        return Category.findAll({ raw: true }).then((categories) => {
          return res.render('tracker', {
            records: data,
            totalAmount,
            yearsList,
            categoriesList: categories,
            monthsList,
            page: page,
            totalPage: totalPage,
            prev: prev,
            next: next
          })
        })
      })
      .catch(next)
  },
  getCreateRecord: (req, res, next) => {
    Category.findAll({ raw: true }).then((categories) => {
      const today = new Date().toISOString().slice(0, 10)
      res.render('newRecord', { categories, today })
    })
  },
  createRecord: (req, res, next) => {
    const userId = req.user.id
    const { product, date, price, location, lat, lng } = req.body
    let { categoryId } = req.body
    if (!categoryId) {
      categoryId = 5
    }
    if (lat !== '') {
      return Marker.findOrCreate({
        raw: true,
        where: { lat: lat, lng: lng, type: 'record', UserId: userId, createdAt: new Date() },
        defaults: { type: 'record', createdTime: date }
      })
        .then((marker) => {
          return Tracker.create({
            product,
            date,
            price,
            CategoryId: categoryId,
            location,
            MarkerId: marker[0].id,
            UserId: userId
          }).then((record) => {
            return res.redirect('/trackers')
          })
        })
        .catch(next)
    }
    return Tracker.create({ product, date, price, CategoryId: categoryId, location, UserId: userId })
      .then((record) => {
        return res.redirect('/trackers')
      })
      .catch(next)
  },
  deleteRecord: (req, res, next) => {
    const userId = req.user.id
    const { recordId } = req.params
    Tracker.findByPk(recordId, { include: { model: Marker } })
      .then((record) => {
        if (!record || userId !== record.UserId) {
          req.flash('error_messages', 'permission denied')
          return res.redirect('..')
        }
        return record.destroy().then((record) => {
          if (record.MarkerId !== null) {
            return Marker.findByPk(record.MarkerId).then((marker) => {
              marker.destroy().then(() => res.redirect('/trackers'))
            })
          }
          return res.redirect('/trackers')
        })
      })
      .catch(next)
  },
  updateRecord: (req, res, next) => {
    const userId = req.user.id
    const { recordId } = req.params
    const { product, date, price, categoryId } = req.body

    Tracker.findByPk(recordId, { include: { model: Marker } })
      .then((record) => {
        if (!record || userId !== record.UserId) {
          req.flash('error_messages', 'permission denied')
          return res.redirect('..')
        }
        return record.update({ product, date, price, CategoryId: categoryId }).then((record) => {
          if (record.MarkerId !== null) {
            return Marker.findByPk(record.MarkerId).then((marker) => {
              marker.update({ createdTime: date }).then(() => {
                return res.redirect('/trackers')
              })
            })
          }
          return res.redirect('/trackers')
        })
      })
      .catch(next)
  },
  updateRecordPage: (req, res, next) => {
    const userId = req.user.id
    const { recordId } = req.params
    Tracker.findByPk(recordId, { raw: true, nest: true, include: { model: Category } })
      .then((record) => {
        if (!record || userId !== record.UserId) {
          req.flash('error_messages', 'permission denied')
          return res.redirect('..')
        }
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
