const express = require('express')
const router = express.Router()
const mongooose = require('mongoose')
const passport = require('passport')

// Loading Post Model
const Post = require('../../models/post')

// @route   GET api/posts/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Posts Works"}))

// @route   Post api/posts/
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (res, req) => {
  const newPost = new Post({
    title: req.body.title,
    name: req.boby.name,
    avatar: req.body.avatar
  })
})

module.exports = router