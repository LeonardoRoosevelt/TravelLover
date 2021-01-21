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
    const {recordId} = req.params
    Tracker.findByPk(recordId).then(record=>{
      return record.destroy().then(record =>{
        res.redirect('/trackers')
      })
    }).catch(next)
  },
  updateRecord:(req, res, next)=>{
    const {recordId} = req.params
    const {product,date,price,categoryId} = req.body
    Tracker.findByPk(recordId).then(record=>{
      return record.update({product, date, price, CategoryId:categoryId}).then(record => {
        res.redirect('/trackers')
      })
    })
    .catch(next)
  },
  updateRecordPage:(req, res, next)=>{
    const {recordId} = req.params
    Tracker.findByPk(recordId,{raw:true,nest:true,include:{model:Category}}).then(record=>{
      categoryName = record.Category.category
      record.date = record.date.toISOString().slice(0, 10)
      return Category.findAll({raw:true}).then(categories=>{
        return res.render('newRecord',{record, categories, categoryName})
      })
    }).catch(next)
  }

}

module.exports = trackController