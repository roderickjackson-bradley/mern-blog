const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  user:     {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  author:   {type: String},
  title:    {type: String, required: true, unique: true },
  content:  {type: String, required: true},
  slug:     {type: String},
  avatar:   {type: String},
  likes:    [{users: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}}],
  comments: [
    { user:     {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
      author:   {type: String},
      content:  {type: String},
      avatar:   {type: String },
      date:     {type: Date, default: Date.now}
    }
  ],
  date: {type: Date, default: Date.now}
})

module.exports = Post = mongoose.model('posts', PostSchema)