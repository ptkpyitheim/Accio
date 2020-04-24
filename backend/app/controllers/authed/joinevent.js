const express = require('express');
const router = express.Router();
const Group = require('../../models/group').Group;

const jsend = require('../../helpers/jsend');

router.post('/', (req, res) => {
  const groupId = req.body.groupId;
  const eventId = req.body.eventId;

  if (groupId == undefined || eventId == undefined) {
    jsend.sendFail(res, 400, {
      message: "please specify groupId or eventId"
    });
    return;
  }
  
  if (req.user.groups.indexOf(req.body.groupId) == -1) {
    jsend.sendFail(res, 400, {message: "user is not a member of that group"});
    return;
  }

  Group.findById(groupId).then(group => {
    if (group == null) {
      jsend.sendFail(res, 400, {
        message: "invalid groupId"
      });
      return;
    }

    // FIX: check if user is already in group
    
    // group.members.push(req.user._id);
    // req.user.events.push(groupId)
    // group.update({_id: groupId, 'events._id': eventId}, {$push: {'events.$.participants': [req.user._id]}});
    let p = Promise.reject(new Error("No event with that id"));

    for (let i = 0; i < group.events.length; i++) {
      let ev = group.events[i];

      if (ev._id.toString() == eventId) {
        if (ev.participants == null) {
          ev.participants = []
        }
        if (ev.participants.indexOf(req.user._id) == -1) {
          ev.participants.push(req.user._id);
        }
        else {
          jsend.sendFail(res, 400, {message: "user is already a participant of that event"});
          return;
        }
        group.save().then(docs => {
          jsend.sendSuccess(res, {});
        }).catch(err => { jsend.sendError(res, err); });
        return;
      }
    }
  }).catch(err => { jsend.sendError(res, err); });

});

module.exports = router;
