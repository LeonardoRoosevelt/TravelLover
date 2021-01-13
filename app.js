const express = require('express')
const app = express()
const port = 3000
app.use('',(req,res)=>{
  res.send('hello world')
})
app.listen(port,(req,res)=>{
  console.log(`this app listen to http://localhost:${port}`)
})