const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const User = require('../../models/user').User;
const Group = require('../../models/group').Group;


router.get('/', (req, res) => {
  const selections = ['username', 'firstName', 'lastName', 'email', 'groups'];
  const liveSelections = selections.slice();
  const postOwnerSelections = selections.slice();

  liveSelections.push('location');
  postOwnerSelections.splice(postOwnerSelections.indexOf('groups'), 1);
  postOwnerSelections.splice(postOwnerSelections.indexOf('email'), 1);

  let populateOptions = {
    path: 'groups',
    model: 'Group',
    populate: [
      {
        path: 'members',
        model: 'User',
        select: selections
      },
      {
        path: 'liveMembers',
        model: 'User',
        select: liveSelections,
        populate: {
          path: 'liveGroup',
          model: 'Group',
          select: ['name']
        }
      },
      {
        path: 'posts.owner',
        model: 'User',
        select: postOwnerSelections
      }
    ]
  }
  
  User.findById(req.user._id).populate(populateOptions).then(doc => {
    
    jsend.sendSuccess(res, { groups: doc.groups });
  }).catch(err => { jsend.sendError(res, err); });
});

module.exports = router;
