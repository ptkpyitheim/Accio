const express = require('express');
const router = express.Router();
const Group = require('../../models/group').Group;

const jsend = require('../../helpers/jsend');

router.post('/', (req, res) => {
  const groupId = req.body.groupId;

  if (groupId == undefined) {
    jsend.sendFail(res, 400, {
      message: "please specify groupId"
    });
    return;
  }

  Group.findById(groupId).then(group => {
    if (group == null) {
      jsend.sendFail(res, 400, {
        message: "invalid groupId"
      });
      return;
    }

    const i = req.user.groups.indexOf(groupId);
    const j = group.members.indexOf(req.user._id);

    if (i === -1 || j === -1) {
      jsend.sendFail(res, 400, {
        message: "user is not part of that group"
      });
      return;
    }

    req.user.groups.splice(i, 1);
    group.members.splice(j, 1);

    Promise.all([req.user.save(), group.save()]).then(docs => {
      jsend.sendSuccess(res, {});
    }).catch(err => { jsend.sendError(res, err); });
  }).catch(err => { jsend.sendError(res, err); });

});

module.exports = router;
