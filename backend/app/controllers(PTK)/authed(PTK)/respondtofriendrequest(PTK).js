
/**************************************** PTK ****************************************/

const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const User = require('../../models/user').User;

router.post('/', (req, res) => {
  if (req.body.accept == null || !req.body.friendId) {
    jsend.sendFail(res, 400, {
      message: "Please specify accept (true/false) and friendId"
    });
    return;
  }


  const incomingReqIndex = req.user.friends.incomingReq.indexOf(req.body.friendId)
  if (incomingReqIndex === -1) {
    jsend.sendFail(res, 400, {
      message: "there is no incoming friend request related to the provided friendId"
    });
    return;
  }

  // move from incoming request to friend list
  req.user.friends.incomingReq.splice(incomingReqIndex, 1);
  if (req.body.accept) {
    req.user.friends.friends.push(req.body.friendId);
  }

  // remove request from sender's outgoing
  // if accept, add to sender's friend list
  User.findById(req.body.friendId).then(friend => {
    const fout = friend.friends.outgoingReq;
    fout.splice(fout.indexOf(req.user._id), 1);
    if (req.body.accept) {
      friend.friends.friends.push(req.user._id);
    }

    return Promise.all([req.user.save(), friend.save()]);
  }).then(v => {
    jsend.sendSuccess(res, {});
  }).catch(err => { jsend.sendError(res, err); });
});

module.exports = router;

/**************************************** PTK ****************************************/

