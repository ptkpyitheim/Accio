const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const User = require('../../models/user').User;
const Group = require('../../models/group').Group;


router.post('/', (req, res) => {
  // requires name, description
  if (req.body.name == undefined || req.body.description == undefined) {
    jsend.sendFail(res, 400, {message: "name or description not provided"});
    return;
  }

  const newGroup = new Group({
    name: req.body.name,
    description: req.body.description,
    owner: req.user._id,
    members: [req.user._id]
  });

  req.user.groups.push(newGroup._id);

  Promise.all([newGroup.save(), req.user.save()]).then(docs => {
    jsend.sendSuccess(res, {group: docs[0]});
  }).catch(err => { jsend.sendError(res, err); });
});

module.exports = router;
