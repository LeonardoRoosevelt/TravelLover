const db = require('../models')
const Tracker = db.Tracker
const Category = db.Category
const dayjs = require('dayjs')

const trackController = {
  getRecord:(req, res, next)=>{
    let totalAmount = 0
    Tracker.findAll({raw:true,nest:true,order:[['date','ASC']],include:[{model:Category}]}).then(records=>{
      records.forEach(record=>{
        record.date = dayjs(record.date).format('YYYY/MM/DD')
        totalAmount += record.price
        record.CategoryId = record.Category.icon
      })
      return res.render('tracker',{records, totalAmount})
    }).catch(next)
  },
  getCreateRecord:(req, res, next)=>{
    Category.findAll({raw:true}).then(categories=>{
      res.render('newRecord',{categories})
    })
    
  },
  createRecord:(req, res, next)=>{
    const {product,date,price,categoryId} = req.body
      Tracker.create({product, date, price,CategoryId:categoryId}).then(record => {
      res.redirect('/trackers')
    })
    .catch(next)
  },
  deleteRecord:(req, res, next)=>{

  },
  updateRecord:(req, res, next)=>{

  }
}

module.exports = trackController