const db = require('../models')
const Tracker = db.Tracker
const Category = db.Category
const dayjs = require('dayjs')
const { yearFilter, arrFilter } = require('../public/javascript/function')

const trackController = {
  getRecord: (req, res, next) => {
    let totalAmount = 0
    let categoriesList = []
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
      '十二月',
    ]
    Tracker.findAll({ raw: true, nest: true, order: [['date', 'ASC']], include: [{ model: Category }] })
      .then((records) => {
        const yearsList = [...new Set(records.map((record) => yearFilter(record.date)))]
        Promise.all([
          records.forEach((record) => {
            record.date = dayjs(record.date).format('YYYY/MM/DD')
            record.CategoryId = record.Category.icon
          }),
          Category.findAll({ raw: true }).then((categories) => {
            categories.forEach((category) => {
              categoriesList.push(category)
            })
          }),
        ])
        totalAmount = records.map((record) => record.price).reduce((a, b) => a + b, 0)
        return res.render('tracker', {
          records,
          totalAmount,
          yearsList,
          categoriesList,
          monthsList,
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
    const { product, date, price, categoryId } = req.body
    Tracker.create({ product, date, price, CategoryId: categoryId })
      .then((record) => {
        res.redirect('/trackers')
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
}

module.exports = trackController
