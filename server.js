
// Express App
const express = require('express')
const bodyParser = require('body-parser')
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')
const app = express()
const port = 8102

// Dependencies 
//const passport = require('passport')
const mongoose = require('mongoose')
const createError = require('http-errors')
const passport = require('passport')
const path = require('path')

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require('./config/key').mongoURI

// Connect to MongoDB
mongoose
  .connect(db, {useNewUrlParser: true})
  .then(() => console.log(`Connected to MongoDB Homie!`))
  .catch((err) => console.log(err))




// Passport middleware
app.use(passport.initialize())

// Passport Config
require('./config/passport')(passport)

// Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

// Server static assets if in production
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'))

  app.get('*', (res, req) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// Body parser middleware
// app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.json())

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