const express = require('express');
const router = express.Router();
const jsend = require('../../helpers/jsend');
const bcrypt = require('bcrypt');
const EmailCode = require('../../models/emailCode').EmailCode;
const uuidv4 = require('uuid/v4');
const sendMail = require('../../helpers/sendMail');

router.post('/', (req, res) => {
  const easyEditable = ["firstName", "lastName", "username"];

  for (let i = 0; i < easyEditable.length; i++) {
    const field = easyEditable[i];
    if (req.body[field]) {
      req.user[field] = req.body[field];
    }
  }

  let tasks = []
  
  // TODO: if password is changed, generate new authtoken
  if (req.body.password) {
    tasks.push(bcrypt.hash(req.body.password, 10).then(hash => {
      req.user.passwordHash = hash;
    }));
  }


  // NOTE: if user is old, and does not have pendingEmailVerification set, it will become true even if req.body.email is null
  if (req.body.email && req.body.email != req.user.email) {
    // store email verification code in db
    req.user.email = req.body.email;
    req.user.pendingEmailVerification = true;

    const task = req.user.save().then(userDoc => {
      // see if there is an existing email code
      return EmailCode.findOne({userId: userDoc._id})
    }).then(codeDoc => {
      if (codeDoc != null) {
        codeDoc.code = uuidv4()
        return codeDoc.save();
      }

      return new EmailCode({
        userId: req.user._id,
        code: uuidv4()
      }).save()
    }).then(codeDoc => {
      // send email confirmation
      return sendMail.sendEmailVerification(req.body.email, codeDoc.code);
    });//.catch(err => jsend.sendError(res, err));

    tasks.push(task);

    // new EmailCode({
    //   userId: req.user._id,
    //   code: uuidv4()
    // }).save().then(codeDoc => {
    //   req.user.pendingEmailVerification = true;
    //   // send email confirmation
    //   return sendMail.sendEmailVerification(body.email, codeDoc.code);
    // });
  }

  Promise.all(tasks).then(foo => {
    return req.user.save();
  }).then(userDoc => {
    jsend.sendSuccess(res, {me: userDoc});
  }).catch(err => jsend.sendError(res, err));

});
module.exports = router;