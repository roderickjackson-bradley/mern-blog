const express =   require('express')
const router =    express.Router()
const mongooose = require('mongoose')
const passport =  require('passport')

// Loading Post Model
const Post =    require('../../models/post')
const Profile = require('../../models/profile')

// Validation
const validatePostInput = require('../../validations/post')

// @route   GET api/posts
// @desc    GET all posts
// @access  Public
router.get('/all', (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({noPostsFound: 'No posts were found'}))
})

// @route   GET api/posts/:id
// @desc    GET post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({noPostFound: 'No post was found with that ID'}))
})

// @route   Post api/posts/
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      user: req.user.id,
      avatar: req.body.avatar,
      author: req.user.author,
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   Put api/posts/edit/:id
// @desc    Edit post by ID
// @access  Private
router.put('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id, req.params.body)
      .then(post => {
        // Check for post Owner
        if(post.author.toString() !== req.user.id){
          return res.status(401).json({notAuthorized: 'user not authorized'})
        }else{
          // Update post
          post.avatar   = req.body.avatar   || post.avatar 
          post.author   = req.body.author   || post.author 
          post.title    = req.body.title    || post.title 
          post.slug     = req.body.slug     || post.slug 
          post.content  = req.body.content  || post.content

          // Save updated post
          post
          .save()
          .then((post) => res.json(post))
          .catch(err => res.status(400).json({failedToUpdate: 'Update not possible'}))
          }
      })
    })
});

// @route   DELETE api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post Owner
          if(post.author.toString() !== req.user.id){
            return res.status(401).json({notAuthorized: 'user not authorized'})
          }
          // Delete
          post
            .remove()
            .then(() => res.json({sucess: true}))
        })
    })
});

// @route   POST api/posts/like/:id
// @desc    Like post by id
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({alreadyliked: 'User already liked this post'})
          }
          // Add user id to like array
          post.likes.unshift({user: req.user.id})
          
          post
            .save()
            .then(post => res.json(post))
        })
        .catch(err => res.status(404).json({postNotFound: 'No post found'}))
    })
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike post by id
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // console.log(post.likes.toString(), '-------STEP1 POST.LIKES-------')
          // if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          //   return res.status(400).json({ notliked: 'You have not yet liked this post' });
          // }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user)
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post));

        })
        .catch(err => console.log(err))
    })
});

module.exports = router