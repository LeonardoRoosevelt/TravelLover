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
  getBlogs: (req, res, next) => {},
  deleteBlog: (req, res, next) => {},
  getRecords: (req, res, next) => {},
  deleteRecord: (req, res, next) => {},
  getCategories: (req, res, next) => {},
  createCategory: (req, res, next) => {},
  editCategory: (req, res, next) => {},
  deleteCategory: (req, res, next) => {},
  getMarkers: (req, res, next) => {},
  deleteMarker: (req, res, next) => {}
}

module.exports = adminController
