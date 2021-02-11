const db = require('../models')
const dayjs = require('dayjs')
const Blog = db.Blog
const Marker = db.Marker
const { yearFilter } = require('../public/javascript/function')
const pageLimit = 10

const blogController = {
  getBlogs: (req, res, next) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    const userId = req.user.id
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
    Blog.findAndCountAll({
      order: [['createdAt', 'DESC']],
      where: { UserId: userId },
      offset: offset,
      limit: pageLimit
    })
      .then((result) => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1
        const yearsList = [...new Set(result.rows.map((b) => yearFilter(b.createdAt)))]
        const data = result.rows.map((b) => ({
          ...b.dataValues,
          createdAt: dayjs(b.createdAt).format('YYYY-MM-DD'),
          description: b.description.length < 50 ? b.description : b.description.substring(0, 50) + ' ......'
        }))
        console.log(data)
        return res.render('blogs', {
          blogs: data,
          yearsList,
          monthsList,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
      .catch(next)
  },
  getBlog: (req, res, next) => {
    const userId = req.user.id
    const blogId = req.params.blogId
    Blog.findByPk(blogId, { raw: true, where: { UserId: userId } })
      .then((blog) => {
        blog.createdAt = dayjs(blog.createdAt).format('YYYY-MM-DD')
        return res.render('blog', { blog })
      })
      .catch(next)
  },
  getCreateBlog: (req, res, next) => {
    res.render('createBlog')
  },
  createBlog: (req, res, next) => {
    const userId = req.user.id
    const { title, description, location, lat, lng } = req.body
    const type = 'blog'
    if (!title) {
      req.flash('error_messages', 'Please enter the title')
      return res.redirect('/blogs')
    }
    if (lat !== '') {
      return Marker.findOrCreate({
        raw: true,
        where: { lat: lat, lng: lng, type: type, UserId: userId, createdTime: new Date() },
        defaults: { createdTime: new Date() }
      })
        .then((marker) => {
          return Blog.create({
            title: title,
            description: description,
            location: location,
            MarkerId: marker[0].id,
            UserId: userId
          }).then((blog) => {
            return res.redirect('/blogs')
          })
        })
        .catch(next)
    }
    return Blog.create({ title: title, description: description, location: location, UserId: userId })
      .then((blog) => {
        return res.redirect('/blogs')
      })
      .catch(next)
  },
  deleteBlog: (req, res, next) => {
    const userId = req.user.id
    const { blogId } = req.params
    Blog.findByPk(blogId)
      .then((blog) => {
        if (!blog || userId !== blog.UserId) {
          req.flash('error_messages', 'permission denied')
          return res.redirect('..')
        }
        return blog.destroy().then((blog) => {
          if (blog.MarkerId !== null) {
            return Marker.findByPk(blog.MarkerId).then((marker) => {
              marker.destroy().then(() => {
                return res.redirect('/blogs')
              })
            })
          }
          return res.redirect('/blogs')
        })
      })
      .catch(next)
  },
  updateBlog: (req, res, next) => {
    const userId = req.user.id
    const { blogId } = req.params
    const { title, description, location } = req.body
    if (!title) {
      req.flash('error_messages', 'Please enter the title')
      return res.redirect('/blogs')
    }

    Blog.findByPk(blogId)
      .then((blog) => {
        if (!blog || userId !== blog.UserId) {
          req.flash('error_messages', 'permission denied')
          return res.redirect('..')
        }

        return blog.update({ title: title, description: description, location: location }).then((blog) => {
          if (blog.MarkerId !== null) {
            return Marker.findByPk(blog.MarkerId).then((marker) => {
              marker.update({ createdTime: new Date() }).then(() => {
                return res.redirect('/blogs')
              })
            })
          }
          return res.redirect('/blogs')
        })
      })
      .catch(next)
  },
  editBlogPage: (req, res, next) => {
    const userId = req.user.id
    const { blogId } = req.params
    Blog.findByPk(blogId, { raw: true }).then((blog) => {
      if (!blog || userId !== blog.UserId) {
        req.flash('error_messages', 'permission denied')
        return res.redirect('..')
      }
      return res.render('createBlog', { blog })
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
