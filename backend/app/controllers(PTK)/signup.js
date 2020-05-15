const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user').User;
const EmailCode = require('../models/emailCode').EmailCode;
const uuidv4 = require('uuid/v4');

const jsend = require('../helpers/jsend');
const sendMail = require('../helpers/sendMail');


router.post('/', (req, res) => {
  const body = req.body;


  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  if (!body.username || !body.password || !body.email || !body.firstName || !body.lastName) {
    jsend.sendFail(res, 400, { message: "one or more required fields missing" });
    return;
  }
  else if (!emailRegex.test(body.email)) {
    jsend.sendFail(res, 400, {message: "invalid email address"});
    return;
  }



  const saltRounds = 10;
  bcrypt.hash(body.password, saltRounds).then(hash => {
    const newUser = new User({
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
      passwordHash: hash,
      authToken: uuidv4(),
      email: body.email
    });
    return newUser.save();
  }).then(userDoc => {
    // store email verification code in db
    return new EmailCode({
      userId: userDoc._id,
      code: uuidv4()
    }).save();
  }).then(codeDoc => {
    // send email confirmation
    return sendMail.sendEmailVerification(body.email, codeDoc.code);
  }).then(info => {
    jsend.sendSuccess(res, {});
  }).catch(err => { jsend.sendError(res, err); });
});

module.exports = router;
