const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/key')


// Load User model
const User = require('../../models/user')

// @route   GET api/users/test
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Users Works"}))

// @route   Post api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      return res.status(400).json({email: 'Email already exists'})
    }else{
      // Search and fetch users avatar or 
      // return generic avatar if user doesn't have one.
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm'
      })
      // Create new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      })

      // Take in ten(genSalt(10)) characters
      // Create function that takes in an error if there is one
      // or bcrypt will give us back a salt
      bcrypt.genSalt(10, (err, salt) => {
        // Pass in the new User's password to get hashed
        // Pass in the salt and a call back that takes in an error if there is one
        // or bcrypt will give us a hash
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // If an error occurs, throw err
          if(err) throw err
          // Set new users password to the hash that bcrypt has provided us
          newUser.password = hash
          // Save the new User
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

// @route   Post api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  // Set email and password variables 
  const email = req.body.email
  const password = req.body.password

  // Find user by email
  User.findOne({email})
    .then(user => {
      // Check for user
      if(!user){
        return res.status(404).json({email: 'Use not found'})
      }
      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            // User Matched
            // Create JWT Payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }
            // Sign Token
            jwt.sign(payload, keys.secretOrKey, 
              // {expiresIn: 31556926},  // 1 year in seconds
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer' + token
                })
               })
          }else{
            return res
              .status(400)
              .json({password: 'Password incorrect'})
          }
        })
    })
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private 
router.get('/current', passport.authenticate('jwt', {session: false}), 
    (req, res) => {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      })
})

module.exports = router