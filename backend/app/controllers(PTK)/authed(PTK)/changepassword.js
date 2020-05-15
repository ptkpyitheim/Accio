const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const User = require('../../models/user').User;

const jsend = require('../../helpers/jsend');


router.post('/', (req, res) => {
  const newPass = req.body.password;
  if (!newPass) {
    jsend.sendFail(res, 400, { message: "please specify password" });
    return;
  }

  bcrypt.hash(newPass, 10).then(hash => {
    req.user.passwordHash = hash;
    req.user.authToken = uuidv4();
    return req.user.save();
  }).then(userDoc => {
    jsend.sendSuccess(res, {
      token: userDoc.authToken
    });
  }).catch(err => { jsend.sendError(res, err); });
});

module.exports = router;
