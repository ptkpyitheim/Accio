const express = require('express');
const router = express.Router();
const path = require("path");
const jsend = require('../../helpers/jsend');
const fs = require('fs');

router.post('/', (req, res) => {
  // TODO: restrict access by owner or group member
  // TODO: use appropriate extension
  if (!req.query.groupId) {
    jsend.sendFail(res, 400, {message: "Please specify groupId in url parameters."});
    return;
  }

  const filePath = path.join(__dirname, "../../../groupPictures/" + req.query.groupId + ".jpg");

  var imageBuffer = new Buffer(req.body, 'base64'); 
  fs.writeFile(filePath, imageBuffer, err => {
    if (err) {
      jsend.sendError(res, err);
    }
    else {
      jsend.sendSuccess(res, {});
    }
  });
});

module.exports = router;
