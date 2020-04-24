const express = require('express');
const router = express.Router();
const Group = require('../../models/group').Group;
const jsend = require('../../helpers/jsend');

router.post('/', (req, res) => {
  if (req.body.latitude == undefined || req.body.longitude == undefined) {
    jsend.sendFail(res, 400, {
      message: "please specify latitude and longitude"
    });
    return;
  }

  req.user.location = {
    latitude: req.body.latitude,
    longitude: req.body.longitude
  }

  req.user.save().then(userDoc => {
    jsend.sendSuccess(res, {});
  }).catch(err => { jsend.sendError(res, err); });

});

module.exports = router;
