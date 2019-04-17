const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  photo: {
    type: Buffer,
    contentType: String
  },
  following: [{type: mongoose.Schema.ObjectId, ref: 'user'}],
  followers: [{type: mongoose.Schema.ObjectId, ref: 'user'}],
  date: {
    type: Date,
    default: Date.now
  }
})

UserSchema.methods.follow = function(id){
  if(this.following.indexOf(id) === -1){
    this.following.push(id);
  }

  return this.save();
};

UserSchema.methods.isFollowing = function(id){
  return this.following.some(function(followId){
    return followId.toString() === id.toString();
  });
};

module.exports = User = mongoose.model('users', UserSchema)