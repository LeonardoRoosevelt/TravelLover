const db = require('../models')
const tracker = db.Tracker

const trackController = {
  getRecord:(req, res, next)=>{
    res.render('tracker')
  },
  createRecord:(req, res, next)=>{

  },
  deleteRecord:(req, res, next)=>{

  },
  updateRecord:(req, res, next)=>{

  }
}

module.exports = trackController