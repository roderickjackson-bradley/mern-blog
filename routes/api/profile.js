const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')


// Loading User Model
const User = require('../../models/user')
const Profile = require('../../models/profile')

// Load Input Validation
const validateProfileInput = require('../../validations/profile')

// @route   GET api/profile/test
// @desc    Test profile route
// @access  Private
router.get('/test', (req, res) => res.json({msg: "Profile Works"}))

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {}

  Profile.findOne({user: req.user.id})
  .then(profile => {
    if(!profile){
      errors.noprofile = 'There is not a profile for this user'
      return res.status(400).json(errors)
    }
  })
  .catch(err => res.status(400).json(err))
})

// @route   GET api/profile/all/
// @desc    GET all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {}
  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles){
      errors.noprofile = 'There are no Profiles'
      return res.status(404).json(errors)
    }
    res.json(profiles)
  })
  .catch(err => res.status(404).json({profiles: 'There is no profile for this user'}))
})

// @route   GET api/profile/username/:username
// @desc    GET user's profile by username
// @access  Public
router.get('/username/:username', (req, res) => {
  const errors = {}

  Profile.findOne({username: req.params.username})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user'
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json({profiles: 'There is no profiles for this user'}))
})

// @route   GET api/profile/user/:user_id
// @desc    GET user's profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {}

  Profile.findOne({username: req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user'
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// @route   POST api/profile
// @desc    Create user's profile
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  // Load Input Validation
  const { errors, isValid } = validateProfileInput(req.body)

  // Check validation
  if (!isValid) {
  return res.status(400).json(errors);
}

  const profileFields = {}
  profileFields.user = req.user.id
  if(req.body.username) profileFields.username = req.body.username
  if(req.body.bio) profileFields.bio = req.body.bio
  if(req.body.photo) profileFields.photo = req.body.photo
  
  Profile.findOne({user: req.user.id})
  .then(profile => {
    if(profile){
      // Update Profile
      Profile.findOneAndUpdate(
        {user: req.user.id}, 
        {$set: profileFields},
        {new: true}
      ).then(profile => res.json(profile))
    }else{
      // Check if username is taken 
      Profile.findOne({username: profileFields.username}).then(profile => {
        if(profile){
          errors.username = 'That username already exsists'
          res.status(400).json(errors)
        }
      //Save
      new Profile(profileFields).save().then(profile => res.json(profile))
      })
    }
  })
})

module.exports = router