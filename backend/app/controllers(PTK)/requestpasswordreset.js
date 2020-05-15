const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user').User;
const EmailCode = require('../models/emailCode').EmailCode;
const uuidv4 = require('uuid/v4');

const jsend = require('../helpers/jsend');
const sendMail = require('../helpers/sendMail');


router.all('/', (req, res) => {
  const email = req.body.email || req.query.email;
  if (!email) {
    jsend.sendFail(res, 400, { message: "no email provided" });
    return;
  }

  User.findOne({email: email}).then(userDoc => {
    if (userDoc == null || userDoc.pendingEmailVerification) {
      jsend.sendFail(res, 400, {message: "that is not a verified email"});
      return;
    }

    return new EmailCode({
      userId: userDoc._id,
      code: uuidv4()
    }).save();
  }).then(ec => {
    // send the email
    return sendMail.sendPasswordReset(email, ec.code);
  }).then(info => {
    jsend.sendSuccess(res, {});
  })
  .catch(err => { jsend.sendError(res, err); });

});

module.exports = router;
