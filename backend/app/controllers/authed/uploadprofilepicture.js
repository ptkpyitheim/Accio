const express = require('express');
const router = express.Router();
const path = require("path");
const jsend = require('../../helpers/jsend');
const fs = require('fs');

router.post('/', (req, res) => {
  // TODO: use appropriate extension
  const filePath = path.join(__dirname, "../../../profilePictures/" + req.user._id + ".jpg");

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
