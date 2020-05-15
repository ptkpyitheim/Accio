const express = require('express');
const router = express.Router();
const Group = require('../../models/group').Group;
const jsend = require('../../helpers/jsend');



router.post('/', (req, res) => {
  const groupId = req.body.groupId;

  // set livegroup on user and add to livemembers of group

  let failMsg = "";
  let failCode = 0;

  if (groupId == undefined) {
    jsend.sendFail(res, 400, {message: "please specify groupId"});
    return;
  }
  else if (req.user.groups.indexOf(groupId) === -1) {
    jsend.sendFail(res, 400, {message: "user is not in that group or groupId is invalid"});
    return;
  }
  else if (req.user.liveGroup != null) {
    jsend.sendFail(res, 400, {message: "liveGroup already set on user"});
    return;
  }

  Group.findById(groupId).then(group => {

    if (group == null) {
      jsend.sendFail(res, 400, {message: "invalid groupId"});
      return;
    }
    else if (group.liveMembers.indexOf(req.user._id) != -1) {
      jsend.sendFail(res, 400, {message: "user is already live in that group"});
      return;
    }

    req.user.liveGroup = group._id;
    group.liveMembers.push(req.user._id);

    Promise.all([req.user.save(), group.save()]).then(docs => {
      jsend.sendSuccess(res, {});
    }).catch(err => { jsend.sendError(res, err); });
  }).catch(err => { jsend.sendError(res, err); });

});

module.exports = router;
