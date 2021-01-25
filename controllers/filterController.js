const db = require('../models')
const Tracker = db.Tracker
const Category = db.Category
const Blog = db.Blog
const dayjs = require('dayjs')
const { monthFilter, yearFilter } = require('../public/javascript/function')

const filterController = {
  filterBlogs: (req, res, next) => {
    const { year, month } = req.query
    let blogList = []
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
    Blog.findAll({ raw: true, nest: true, order: [['createdAt', 'DESC']] }).then((blogs) => {
      const yearsList = [...new Set(blogs.map((blog) => yearFilter(blog.createdAt)))]
      Promise.all([
        blogs.map((blog) => {
          let currentYear = yearFilter(blog.createdAt).toString()
          let currentMonth = monthsList[monthFilter(blog.createdAt)]
          if (month === '全部' && year === '全部') {
            blogList.push(blog)
          } else if (year === '全部' && month === currentMonth) {
            blogList.push(blog)
          } else if (month === '全部' && year === currentYear) {
            blogList.push(blog)
          } else if (month === currentMonth && year === currentYear) {
            blogList.push(blog)
          } else {
            console.log('error')
          }
        }),
      ])
      blogList.forEach((blog) => {
        blog.createdAt = dayjs(blog.createdAt).format('YYYY/MM/DD')
      })
      return res.render('index', {
        blogs: blogList,
        yearsList,
        monthsList,
        years: year,
        months: month,
      })
    })
  },
  filterRecords: (req, res, next) => {
    const { year, month, category } = req.query
    let categoriesList = []
    let recordsList = []
    let totalAmount = 0
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
          records.map((record) => {
            let currentYear = yearFilter(record.date).toString()
            let currentMonth = monthsList[monthFilter(record.date)]
            if (category === '全部' && month === '全部' && year === '全部') {
              recordsList.push(record)
            } else if (month === '全部' && year === '全部') {
              if (category === record.Category.category) {
                recordsList.push(record)
              }
            } else if (category === '全部' && year === '全部') {
              if (month === currentMonth) {
                recordsList.push(record)
              }
            } else if (month === '全部' && category === '全部') {
              if (year === currentYear) {
                recordsList.push(record)
              }
            } else if (year === '全部') {
              if (month === currentMonth && category === record.Category.category) {
                recordsList.push(record)
              }
            } else if (month === '全部') {
              if (year === currentYear && category === record.Category.category) {
                recordsList.push(record)
              }
            } else if (category === '全部') {
              if (month === currentMonth && year === currentYear) {
                recordsList.push(record)
              }
            } else {
              if (month === currentMonth && category === record.Category.category && year === currentYear) {
                recordsList.push(record)
              }
            }
          }),
          Category.findAll({ raw: true }).then((categories) => {
            categories.forEach((category) => {
              categoriesList.push(category)
            })
          }),
        ])
        recordsList.forEach((record) => {
          record.date = dayjs(record.date).format('YYYY/MM/DD')
          record.CategoryId = record.Category.icon
        })
        totalAmount = recordsList.map((record) => record.price).reduce((a, b) => a + b, 0)
        return res.render('tracker', {
          records: recordsList,
          yearsList,
          categoriesList,
          monthsList,
          totalAmount,
          years: year,
          months: month,
          categories: category,
        })
      })
      .catch(next)
  },
}

module.exports = filterController
