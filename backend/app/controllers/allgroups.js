const express = require('express');
const router = express.Router();
const Group = require('../models/group').Group;
const User = require('../models/user').User;

const jsend = require('../helpers/jsend');

router.get('/', (req, res) => {
  let filter = {};
  if (req.query.filter != undefined) {
    filter.name = new RegExp(req.query.filter);
  }

  let findUserToExcludeByPromise = Promise.resolve();
  // optional fields - excludeByToken or excludeByUserId
  if (req.query.excludeByToken) {
    findUserToExcludeByPromise = User.findOne({authToken: req.query.excludeByToken});
  }

  const fields = {
    _id: 1,
    owner: 1,
    name: 1,
    description: 1,
    members: 1,
    posts: 1
  };

  findUserToExcludeByPromise.then(user => {
    if (user) {
      filter.members = {"$ne": user._id};
    }
    return Group.find(filter, fields).populate(
      {
      path: 'posts.owner',
      model: 'User',
      select: ['username', 'firstName', 'lastName']
    });
  }).then(groups => {
    jsend.sendSuccess(res, {groups: groups});
  }).catch(err => { jsend.sendError(res, err); })

});

module.exports = router;
