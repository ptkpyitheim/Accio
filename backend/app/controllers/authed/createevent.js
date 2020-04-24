const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const jsend = require('../../helpers/jsend');
const Group = require('../../models/group').Group;


router.post('/', (req, res) => {
  let body = req.body;
  if (body.name == null || body.description == null || body.groupId == null) {
    jsend.sendFail(res, 400, {message: "please specify groupId, name and description"});
    return;
  }

  // verify that user is in group
  if (req.user.groups.indexOf(body.groupId) == -1) {
    jsend.sendFail(res, 400, {message: "user is not a member of that group"});
    return;
  }

  Group.findById(body.groupId).then(group => {
    let objId = mongodb.ObjectId()
    group.events.push({
      _id: objId,
      name: body.name,
      description: body.description,
      address: body.address,
      datetime: new Date(body.datetime),
      host: req.user._id
    });
    group.save().then(group => {
      jsend.sendSuccess(res, {event: group.events.id(objId)});
    }).catch(err => { jsend.sendError(res, err); });
  }).catch(err => { jsend.sendError(res, err); });
});

module.exports = router;
