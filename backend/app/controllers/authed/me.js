const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
router.all('/', (req, res) => {
  const selections = ['username', 'firstName', 'lastName', 'email', 'groups', 'location', 'liveGroup'];
  const g_selections = ["name", "owner"];
  
  req.user.populate([
    {
      path: 'friends.friends',
      ref: 'User',
      select: selections
    },
    {
      path: 'friends.incomingReq',
      ref: 'User',
      select: selections
    },
    {
      path: 'friends.outgoingReq',
      ref: 'User',
      select: selections
    },
    {
      path: 'incomingGroupReq.user',
      ref: 'User',
      select: selections
    },
    {
      path: 'incomingGroupReq.group',
      model: 'Group',
      select: g_selections
    },
    {
      path: 'outgoingGroupReq',
      ref: 'Group',
      select: g_selections
    }
  ]).execPopulate().then(userDoc => {
    jsend.sendSuccess(res, { me: userDoc });
  });
});
module.exports = router;