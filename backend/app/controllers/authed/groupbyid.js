const express = require('express');
const router = express.Router();
const Group = require('../../models/group').Group;
const jsend = require('../../helpers/jsend');

router.get('/', (req, res) => {
  if (!req.query.groupId) {
    jsend.sendFail(res, 400, {
      message: "please specify groupId"
    });
    return;
  }

  Group.findById(req.query.groupId).then(group => {
    // NOTE: if statement checks if user is a member of group. 
    // If they are not, members and liveMembers are not populated for privacy reasons.
    // Currently this check is being ignored.
    if (true || req.user.groups.indexOf(group._id) != -1) {
      const selections = ['username', 'firstName', 'lastName', 'email', 'groups'];
      const liveSelections = selections.slice();
      const postOwnerSelections = selections.slice();

      liveSelections.push('location');
      postOwnerSelections.splice(postOwnerSelections.indexOf('groups'), 1);
      postOwnerSelections.splice(postOwnerSelections.indexOf('email'), 1);

      let populateOptions = [
        {
          path: 'members',
          model: 'User',
          select: selections
        },
        {
          path: 'liveMembers',
          model: 'User',
          select: liveSelections
        },
        {
          path: 'posts.owner',
          model: 'User',
          select: postOwnerSelections
        }
      ];
      
      return group.populate(populateOptions).execPopulate();
    }
    else {
      return group;
    }
  }).then(group => {
    jsend.sendSuccess(res, {group: group});
  }).catch(err => {
    jsend.sendError(res, err);
  })

});

module.exports = router;
