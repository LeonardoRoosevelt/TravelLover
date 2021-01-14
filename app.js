const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const routes = require('./routes')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(routes)


app.listen(port,(req,res)=>{
  console.log(`this app listen to http://localhost:${port}`)
})