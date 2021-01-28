const db = require('../models')
const dayjs = require('dayjs')
const Blog = db.Blog
const Marker = db.Marker
const { yearFilter } = require('../public/javascript/function')

const blogController = {
  getBlog: (req, res, next) => {
    const monthsList = [
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
    Blog.findAll({ raw: true, order: [['createdAt', 'DESC']] })
      .then((blogs) => {
        const yearsList = [...new Set(blogs.map((blog) => yearFilter(blog.createdAt)))]
        blogs.forEach((blog) => {
          blog.createdAt = dayjs(blog.createdAt).format('YYYY-MM-DD')
        })
        return res.render('index', { blogs, yearsList, monthsList })
      })
      .catch(next)
  },
  getCreateBlog: (req, res, next) => {
    res.render('createBlog')
  },
  createBlog: (req, res, next) => {
    const { title, description } = req.body

    Blog.create({ title: title, description: description })
      .then((blog) => {
        return res.redirect('/blogs')
      })
      .catch(next)
  },
  deleteBlog: (req, res, next) => {
    const { blogId } = req.params
    Blog.findByPk(blogId)
      .then((blog) => {
        return blog.destroy().then((blog) => {
          res.redirect('/blogs')
        })
      })
      .catch(next)
  },
  updateBlog: (req, res, next) => {
    const { blogId } = req.params
    const { title, description, location } = req.body

    Blog.findByPk(blogId)
      .then((blog) => {
        return blog.update({ title: title, description: description, location: location }).then((blog) => {
          res.redirect('/blogs')
        })
      })
      .catch(next)
  },
  editBlogPage: (req, res, next) => {
    const { blogId } = req.params
    Blog.findByPk(blogId, { raw: true }).then((blog) => {
      res.render('createBlog', { blog })
    })
  },
  getCreateBlogByLocationRequest: (req, res, next) => {
    const { location, locationName } = req.params
    // 獲得latLng
    const latLng = location
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim())
    const lat = latLng[0]
    const lng = latLng[1]
    res.render('createBlog', { lat, lng, locationName })
  }
}

module.exports = blogController
