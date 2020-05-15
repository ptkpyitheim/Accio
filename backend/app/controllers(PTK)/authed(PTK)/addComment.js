const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const Comment = require('../../models/comment').Comment;
const Group = require('../../models/group').Group;


router.post('/', (req, res) => {
  if (!req.body.postId || !req.body.text) {
    jsend.sendFail(res, 400, {message: "Please specify postId and text"});
    return;
  }


  Group.findOne({ "posts._id": req.body.postId }).then(g => {
    if (g == null) {
      jsend.sendFail(res, 400, {message: "Invalid postId"});
      return;
    }
    else if (g.members.indexOf(req.user._id) === -1) {
      jsend.sendFail(res, 400, {message: "User is not a member of the group associated with that post"});
      return;
    }

    return new Comment({
      author: req.user._id,
      postId: req.body.postId,
      text: req.body.text
    }).save();


  }).then(newComment => {
    jsend.sendSuccess(res, {
      comment: newComment
    });
  }).catch(err => console.log(err));
});

module.exports = router;
