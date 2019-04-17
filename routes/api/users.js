const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/key')

// Load Input Validation
const validateRegisterInput = require('../../validations/register')
const validateLoginInput = require('../../validations/login')

// Load User model
const User = require('../../models/user')
// Load User model
const Profile = require('../../models/profile')

// @route   GET api/users/test
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Users Works"}))

// @route   Post api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
   // Form validation
   const { errors, isValid } = validateRegisterInput(req.body);

   // Check validation
   if (!isValid) {
     return res.status(400).json(errors);
   }

  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      errors.email = 'Email already exists'
      return res.status(400).json(errors)
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

     // Form validation
     const { errors, isValid } = validateLoginInput(req.body);

     // Check validation
     if (!isValid) {
       return res.status(400).json(errors);
     }

  // Find user by email
  User.findOne({email})
    .then(user => {
      // Check for user
      if(!user){
        errors.email = 'Use not found'
        return res.status(404).json(email)
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
                  token: 'Bearer ' + token
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

// @route   POST api/users/follow/:id
// @desc    Follow user by id
// @access  Private
router.post('/follow/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // The passport.authenticate() function will return the current user
  // Set the currentUser variable to req.user
  let currentUser = req.user
  // Find the user you want to follow by ID
  User.findById(req.params.id)
  .then(user => {
    // Push the id of the user that you're following into the following Array
    currentUser.following.unshift(req.params.id)
    // Now set the user variable to currentUser
    let User = currentUser
    // Save the user object since we updated the following Array
    User
      .save()
      .then(user => res.json(user))
      .catch(err => console.log(err))
  }).catch(err => console.log(err))
});

// @route   POST api/users/unfollow/:id
// @desc    Unfollow user by id
// @access  Private
router.post('/unfollow/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // The passport.authenticate() function will return the current user
  // Set the currentUser variable to req.user
  let currentUser = req.user
  // Find the user you want to unfollow by ID
  User.findById(req.params.id)
  .then(user => {
    // Create removeIndex
    const removeIndex = currentUser.following
      .map(item => item.user)
      .indexOf(req.params.id)
    // Splice array
    currentUser.following.splice(removeIndex, 1)

    // Now set the user variable to currentUser
    let User = currentUser
    // Save the user object since we updated the following Array
    User
      .save()
      .then(user => res.json(user))
      .catch(err => console.log(err))
  }).catch(err => console.log(err))
});

// @route   GET api/posts
// @desc    GET all posts
// @access  Public
router.get('/all', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(404).json({noUsersFound: 'No users were found'}))
})

module.exports = router