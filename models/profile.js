const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  username: {
    type: String,
    required: true,
    max: 40
  },
  bio: {
    type: String,
    required: true
  },
  photo: {
    type: Buffer,
    contentType: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)