const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const Group = require('../../models/group').Group;


router.post('/', (req, res) => {
  let body = req.body;
  if (body.title == null || body.content == null || body.groupId == null) {
    jsend.sendFail(res, 400, {message: "please specify title, content, and groupId"});
    return;
  }

  // verify that user is in group
  if (req.user.groups.indexOf(body.groupId) == -1) {
    jsend.sendFail(res, 400, {message: "user is not a member of that group"});
    return;
  }

  Group.findById(body.groupId).then(group => {
    let post = {
      _id: mongodb.ObjectId(),
      title: body.title,
      content: body.content,
      owner: req.user._id
    };
    group.posts.push(post);

    group.save().then(group => {
      jsend.sendSuccess(res, {
        post: group.posts.id(post._id)
      });
      
    }).catch(err => { jsend.sendError(res, err); });

  }).catch(err => { jsend.sendError(res, err); });
});

module.exports = router;
