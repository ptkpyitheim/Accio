const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Post'
  },
  author: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  }
})


const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
  Comment: Comment
}
