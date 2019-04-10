const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')


// Load User model
const User = require('../../models/user')

// @route   GET api/users/test
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Users Works"}))

// @route   GET api/users/register
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

module.exports = router