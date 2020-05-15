const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const Comment = require('../../models/comment').Comment;
const Group = require('../../models/group').Group;


router.all('/', (req, res) => {
  const postId = req.body.postId || req.query.postId;
  if (!postId) {
    jsend.sendFail(res, 400, {message: "Please specify postId"});
    return;
  }
  
  Comment.find({ postId: postId })
    .populate({
      path: 'author',
      model: 'User',
      select: ["username", "firstName", "lastName"]
    })
    .then(comments => {
      jsend.sendSuccess(res, {
        comments: comments
      });
    }).catch(err => jsend.sendError(res, err));
});

module.exports = router;
