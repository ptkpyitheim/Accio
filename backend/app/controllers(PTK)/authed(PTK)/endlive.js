const express = require('express');
const router = express.Router();
const Group = require('../../models/group').Group;
const jsend = require('../../helpers/jsend');


router.all('/', (req, res) => {
  const groupId = req.body.groupId;

  if (req.user.liveGroup == null) {
    jsend.sendFail(res, 400, {
      message: "liveGroup is not set on user (user is not live)"
    });
    return;
  }

  Group.findById(req.user.liveGroup).then(group => {
    req.user.liveGroup = null;
    group.liveMembers.splice(group.liveMembers.indexOf(req.user._id), 1);

    Promise.all([req.user.save(), group.save()]).then(docs => {
      jsend.sendSuccess(res, {});
    }).catch(err => { jsend.sendError(res, err); });
  }).catch(err => { jsend.sendError(res, err); });

});

module.exports = router;
