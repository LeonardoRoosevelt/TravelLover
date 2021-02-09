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
          [sequelize.fn('COUNT', sequelize.col('Blogs.UserId')), 'totalBlog'],
          [sequelize.fn('COUNT', sequelize.col('Markers.UserId')), 'totalMarker'],
          [sequelize.fn('SUM', sequelize.col('Trackers.Price')), 'totalAmount']
        ]
      },
      include: [
        { model: Blog, attributes: [] },
        { model: Tracker, attributes: [] },
        { model: Marker, attributes: [] }
      ],
      group: ['User.id']
    })
      .then((users) => {
        console.log(users)
        return res.render('./admin/users', { users })
      })
      .catch(next)
  },
  deleteUser: (req, res, next) => {},
  getBlogs: (req, res, next) => {},
  getBlog: (req, res, next) => {},
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
