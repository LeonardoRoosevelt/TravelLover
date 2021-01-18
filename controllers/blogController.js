const db = require('../models')
const Blog = db.Blog

const blogController = {
  getBlog:(req, res, next) =>{
    Blog.findAll({ raw: true }).then(blogs=>{
      return res.render('index',{blogs})
  }).catch(next)
  },
  getCreateBlog:(req, res, next) =>{
    res.render('createBlog')
  },
  createBlog:(req,res,next) =>{
    const {title,description} = req.body  

    Blog.create({title:title,description:description}).then( blog =>{
      return res.redirect('/blogs')
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