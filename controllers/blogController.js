const db = require('../models')
const Blog = db.Blog

const blogController = {
  getBlog:(req, res, next) =>{
    res.render('index')
  },
  createBlog:(req,res,next) =>{
    const {description} = req.body

    Blog.create({description:description}).then(() =>{
      return res.json('all right')
    }).catch(next)

  },
  deleteBlog:(req,res,next) =>{
    const {blogId} = req.params
    
    Blog.findByPk(blogId).then(blog=>{
      return blog.destroy()
    }).catch(next)
  },
  updateBlog:(req,res,next)=>{
    const {blogId} = req.params
    const {description} = req.body
    
    Blog.findByPk(blogId).then(blog=>{
      return blog.update({description:description})
    }).catch(next)
  }
}

module.exports = blogController