const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        ref: 'users'
      },
      name: {
        type: String,
        required: true
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now
      },
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Post = mongoose.model('posts', PostSchema)