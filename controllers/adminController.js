const dayjs = require('dayjs')
const sequelize = require('sequelize')
const db = require('../models')
const User = db.User
const Blog = db.Blog
const Marker = db.Marker
const Tracker = db.Tracker

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
  getCategories: (req, res, next) => {},
  createCategory: (req, res, next) => {},
  editCategory: (req, res, next) => {},
  deleteCategory: (req, res, next) => {},
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
        console.log(markers)
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
