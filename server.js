
// Express App
const express = require('express')
const bodyParser = require('body-parser')
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')
const app = express()
const port =  process.env.PORT || 8102

// Dependencies 
//const passport = require('passport')
const mongoose = require('mongoose')
const createError = require('http-errors')

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// DB Config
const db = require('./config/key').mongoURI

// Connect to MongoDB
mongoose
  .connect(db, {useNewUrlParser: true})
  .then(() => console.log(`Connected to MongoDB Homie!`))
  .catch((err) => console.log(err))

// app.use(express.json())
// app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => res.send(`Hello Homie`))

// Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

// Passport Config
/*
Add Passport Config here
*/

// Passport Middleware
/*
Add Passport Middleware here
*/

app.listen(port, () => console.log(`Back End Server is Running on ${port}`))

// Catch 404 errors and forward to error handler
app.use(function(req, res, next){
  next(createError(404))
})

module.exports = app