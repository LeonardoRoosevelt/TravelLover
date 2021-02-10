const dayjs = require('dayjs')
const sequelize = require('sequelize')
const db = require('../models')
const User = db.User
const Blog = db.Blog
const Marker = db.Marker
const Tracker = db.Tracker
const Category = db.Category

const adminController = {
  getUsers: (req, res, next) => {
    User.findAll({
      raw: true,
      nest: true,
      where: { isAdmin: false },
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Blogs WHERE Blogs.UserId = User.id)'), 'totalBlog'],
          [sequelize.literal('(SELECT COUNT(*) FROM Markers WHERE Markers.UserId = User.id)'), 'totalMarker'],
          [
            sequelize.literal('(SELECT SUM(Trackers.Price) FROM Trackers WHERE Trackers.UserId = User.id)'),
            'totalAmount'
          ]
        ]
      }
    })
      .then((users) => {
        users.map((user) => {
          user.totalAmount = !user.totalAmount ? 0 : user.totalAmount
        })
        return res.render('./admin/users', { users })
      })
      .catch(next)
  },
  deleteUser: (req, res, next) => {
    const { userId } = req.params
    Promise.all([
      User.findByPk(userId).then((user) => user.destroy()),
      Blog.findAll({ where: { UserId: userId } }).then((blogs) => {
        blogs.forEach((blog) => {
          blog.destroy()
        })
      }),
      Marker.findAll({ where: { UserId: userId } }).then((markers) => {
        markers.forEach((marker) => {
          marker.destroy()
        })
      }),
      Tracker.findAll({ where: { UserId: userId } }).then((records) => {
        records.forEach((record) => {
          record.destroy()
        })
      })
    ]).then(() => {
      return res.redirect('back')
    })
  },
  getBlogs: (req, res, next) => {
    const { userId } = req.params
    return Blog.findAll({
      raw: true,
      nest: true,
      where: { UserId: userId },
      include: { model: User, attributes: ['id', 'account'] }
    })
      .then((blogs) => {
        blogs.forEach((blog) => {
          blog.createdAt = dayjs(blog.createdAt).format('YYYY-MM-DD')
          blog.description =
            blog.description.length < 10 ? blog.description : blog.description.substring(0, 10) + ' ......'
        })
        return res.render('./admin/blogs', { userId, blogs })
      })
      .catch(next)
  },
  deleteBlog: (req, res, next) => {
    const { userId, blogId } = req.params
    Blog.findByPk(blogId, { where: { UserId: userId } })
      .then((blog) => {
        if (blog.MarkerId !== null) {
          blog.destroy()
          return Marker.findByPk(blog.MarkerId).then((marker) => {
            return marker.destroy()
          })
        }
        return blog.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(next)
  },
  getRecords: (req, res, next) => {
    const { userId } = req.params
    return Tracker.findAll({
      raw: true,
      nest: true,
      where: { UserId: userId },
      include: { model: User, attributes: ['id', 'account'] }
    })
      .then((records) => {
        records.forEach((record) => {
          record.date = dayjs(record.date).format('YYYY-MM-DD')
        })
        return res.render('./admin/trackers', { userId, records })
      })
      .catch(next)
  },
  deleteRecord: (req, res, next) => {
    const { userId, trackerId } = req.params
    Tracker.findByPk(trackerId, { where: { UserId: userId } })
      .then((record) => {
        if (record.MarkerId !== null) {
          record.destroy()
          return Marker.findByPk(record.MarkerId).then((marker) => {
            return marker.destroy()
          })
        }
        return record.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(next)
  },
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true, nest: true }).then((categories) => {
      res.render('./admin/categories', { categories })
    })
  },
  createCategory: (req, res, next) => {
    const { name } = req.body
    let { icon } = req.body
    let repeatCategory = false
    if (!name) {
      req.flash('error_messages', "you don't put on the category name")
      res.redirect(`/admin/categories`)
    }
    if (!icon) {
      icon = 'fa-info'
    }
    Category.findAll({ raw: true, nest: true })
      .then((categories) => {
        categories.forEach((category) => {
          if (name === category.category) {
            repeatCategory = true
          }
        })
        if (repeatCategory) {
          req.flash('error_messages', 'this category already exist')
          return res.redirect(`/admin/categories`)
        }
        return Category.create({ category: name, icon: icon }).then(() => res.redirect('back'))
      })
      .catch(next)
  },
  getCategory: (req, res, next) => {
    const { categoryId } = req.params
    Category.findAll({ raw: true, nest: true })
      .then((categories) => {
        return Category.findByPk(categoryId, { raw: true, nest: true }).then((category) => {
          return res.render('./admin/categories', { categories, category })
        })
      })
      .catch(next)
  },
  editCategory: (req, res, next) => {
    const { name, icon } = req.body
    const { categoryId } = req.params
    let repeatCategory = false
    if (!name) {
      req.flash('error_messages', "you don't put on the category name")
      res.redirect(`/admin/categories/${categoryId}`)
    }
    Category.findByPk(categoryId)
      .then((category) => {
        Category.findAll({ raw: true, nest: true }).then((categories) => {
          Promise.all([
            categories.forEach((category) => {
              if (name === category.category && Number(categoryId) !== category.id) {
                repeatCategory = true
              }
            })
          ]).then(() => {
            if (repeatCategory) {
              req.flash('error_messages', 'this category already exist')
              return res.redirect(`/admin/categories/${categoryId}`)
            }
            return category
              .update({ category: name ? name : category.category, icon: icon ? icon : category.icon })
              .then(() => res.redirect('/admin/categories'))
          })
        })
      })
      .catch(next)
  },
  deleteCategory: (req, res, next) => {
    const { categoryId } = req.params
    Category.findByPk(categoryId)
      .then((category) => {
        category.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(next)
  },
  getMarkers: (req, res, next) => {
    const { userId } = req.params
    return Marker.findAll({
      raw: true,
      nest: true,
      where: { UserId: userId },
      include: [
        { model: User, attributes: ['id', 'account'] },
        { model: Tracker, attributes: ['location', 'product', 'id'] },
        { model: Blog, attributes: ['location', 'title', 'id'] }
      ]
    })
      .then((markers) => {
        markers = markers.map((marker) => ({
          ...marker,
          infoId: marker.type === 'blog' ? marker.Blogs.id : marker.Trackers.id
        }))
        return res.render('./admin/markers', { userId, markers })
      })
      .catch(next)
  },
  deleteMarker: (req, res, next) => {
    const { userId, markerId, infoId } = req.params
    Marker.findByPk(markerId, {
      where: { UserId: userId }
    })
      .then((marker) => {
        return marker.destroy().then((marker) => {
          if (marker.type === 'blog') {
            return Blog.findByPk(infoId).then((blog) => {
              blog.destroy()
            })
          }
          return Tracker.findByPk(infoId).then((record) => {
            record.destroy()
          })
        })
      })
      .then(() => res.redirect('back'))
      .catch(next)
  }
}

module.exports = adminController
