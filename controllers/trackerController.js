const db = require('../models')
const Tracker = db.Tracker
const dayjs = require('dayjs')

const trackController = {
  getRecord:(req, res, next)=>{
    let totalAmount = 0
    Tracker.findAll({raw: true,order:[['date','ASC']]}).then(records=>{
      records.forEach(record=>{{
        record.date = dayjs(record.date).format('YYYY/MM/DD')
        totalAmount += record.price
      }})
      return res.render('tracker',{records, totalAmount})
    }).catch(next)
  },
  getCreateRecord:(req, res, next)=>{
    res.render('newRecord')
  },
  createRecord:(req, res, next)=>{
    const {product,date,price} = req.body
    Tracker.create({product, date, price}).then(record => {
      res.redirect('/trackers')
    }).catch(next)
  },
  deleteRecord:(req, res, next)=>{

  },
  updateRecord:(req, res, next)=>{

  }
}

module.exports = trackController