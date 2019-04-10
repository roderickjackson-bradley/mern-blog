const express = require('express')
const router = express.Router()

// @route   GET api/profile/test
// @desc    Test profile route
// @access  Private
router.get('/test', (req, res) => res.json({msg: "Profile Works"}))

module.exports = router